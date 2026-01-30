<?php
/**
 * API handler for FactPress
 */

if (!defined('ABSPATH')) {
    exit;
}

class Mira_Verify_API {

    /**
     * Make authenticated API request
     */
    public static function request($endpoint, $args = array()) {
        if (!Mira_Verify::is_configured()) {
            return new WP_Error('not_configured', __('Service URL not configured.', 'mira-verify'));
        }

        $access_token = Mira_Verify_OAuth::get_access_token();

        if (empty($access_token)) {
            return new WP_Error('not_connected', __('Not connected to FactPress.', 'mira-verify'));
        }

        $api_url = Mira_Verify::get_api_url();

        $defaults = array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $access_token,
                'Content-Type' => 'application/json',
            ),
            'timeout' => 60,
        );

        $args = wp_parse_args($args, $defaults);
        $args['headers'] = array_merge($defaults['headers'], isset($args['headers']) ? $args['headers'] : array());

        $response = wp_remote_request($api_url . $endpoint, $args);

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);

        // Handle token expiration
        if ($status_code === 401) {
            $body = json_decode(wp_remote_retrieve_body($response), true);

            if (isset($body['code']) && $body['code'] === 'TOKEN_EXPIRED') {
                $refresh_result = Mira_Verify_OAuth::refresh_token();

                if (is_wp_error($refresh_result)) {
                    return $refresh_result;
                }

                // Retry with new token
                $args['headers']['Authorization'] = 'Bearer ' . Mira_Verify_OAuth::get_access_token();
                return wp_remote_request($api_url . $endpoint, $args);
            }

            return new WP_Error('unauthorized', __('Authentication failed.', 'mira-verify'));
        }

        return $response;
    }

    /**
     * Get account status
     */
    public static function get_status() {
        $response = self::request('/status', array('method' => 'GET'));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($status_code !== 200) {
            return new WP_Error('api_error', isset($body['error']) ? $body['error'] : __('Failed to get status.', 'mira-verify'));
        }

        return $body;
    }

    /**
     * AJAX handler for verification - proxies SSE stream from API
     * Token stays server-side, never exposed to JavaScript
     */
    public static function ajax_verify_content() {
        check_ajax_referer('mira_verify_nonce', 'nonce');

        if (!current_user_can('edit_posts')) {
            self::send_sse_error(__('Permission denied.', 'mira-verify'));
            return;
        }

        if (!Mira_Verify::is_configured()) {
            self::send_sse_error(__('Service URL not configured.', 'mira-verify'));
            return;
        }

        $access_token = Mira_Verify_OAuth::get_access_token();

        if (empty($access_token)) {
            self::send_sse_error(__('Not connected to FactPress.', 'mira-verify'));
            return;
        }

        $content = isset($_POST['content']) ? wp_kses_post($_POST['content']) : '';
        $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
        $post_title = isset($_POST['post_title']) ? sanitize_text_field($_POST['post_title']) : '';

        if (empty($content)) {
            self::send_sse_error(__('No content to verify.', 'mira-verify'));
            return;
        }

        // Strip HTML tags and get plain text
        $plain_content = wp_strip_all_tags($content);

        if (strlen($plain_content) < 10) {
            self::send_sse_error(__('Content is too short to verify.', 'mira-verify'));
            return;
        }

        // Set headers for SSE
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('X-Accel-Buffering: no'); // Disable nginx buffering

        // Disable output buffering
        while (ob_get_level()) {
            ob_end_clean();
        }

        // Increase time limit for long-running requests
        set_time_limit(300);

        $api_url = Mira_Verify::get_api_url() . '/verify';

        $body = wp_json_encode(array(
            'content' => $plain_content,
            'postId' => (string) $post_id,
            'postTitle' => $post_title,
        ));

        $context = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header' => implode("\r\n", array(
                    'Authorization: Bearer ' . $access_token,
                    'Content-Type: application/json',
                    'Accept: text/event-stream',
                )),
                'content' => $body,
                'timeout' => 300,
                'ignore_errors' => true,
            ),
            'ssl' => array(
                'verify_peer' => true,
                'verify_peer_name' => true,
            ),
        ));

        $stream = @fopen($api_url, 'r', false, $context);

        if (!$stream) {
            echo 'data: ' . wp_json_encode(array('type' => 'error', 'data' => array('message' => 'Failed to connect to verification service'))) . "\n\n";
            flush();
            exit;
        }

        // Check for HTTP errors in response headers
        $meta = stream_get_meta_data($stream);
        if (isset($meta['wrapper_data'])) {
            foreach ($meta['wrapper_data'] as $header) {
                if (preg_match('/^HTTP\/\d\.\d (\d{3})/', $header, $matches)) {
                    $status_code = intval($matches[1]);
                    if ($status_code >= 400) {
                        $error_body = stream_get_contents($stream);
                        fclose($stream);
                        $error_data = json_decode($error_body, true);
                        $error_message = isset($error_data['error']) ? $error_data['error'] : 'API error: ' . $status_code;
                        echo 'data: ' . wp_json_encode(array('type' => 'error', 'data' => array('message' => $error_message))) . "\n\n";
                        flush();
                        exit;
                    }
                    break;
                }
            }
        }

        // Stream the response
        while (!feof($stream)) {
            $chunk = fread($stream, 8192);
            if ($chunk !== false && $chunk !== '') {
                echo $chunk;
                flush();
            }
        }

        fclose($stream);
        exit;
    }

    /**
     * Send SSE error and exit
     */
    private static function send_sse_error($message) {
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');

        while (ob_get_level()) {
            ob_end_clean();
        }

        echo 'data: ' . wp_json_encode(array('type' => 'error', 'data' => array('message' => $message))) . "\n\n";
        flush();
        exit;
    }

    /**
     * AJAX handler for status
     */
    public static function ajax_get_status() {
        check_ajax_referer('mira_verify_nonce', 'nonce');

        if (!current_user_can('edit_posts')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'mira-verify')));
        }

        $status = self::get_status();

        if (is_wp_error($status)) {
            wp_send_json_error(array('message' => $status->get_error_message()));
        }

        wp_send_json_success($status);
    }
}

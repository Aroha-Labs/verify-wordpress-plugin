<?php
/**
 * OAuth handler for Mira Verify
 */

if (!defined('ABSPATH')) {
    exit;
}

class Mira_Verify_OAuth {

    /**
     * Get stored access token
     */
    public static function get_access_token() {
        return get_option('mira_verify_access_token', '');
    }

    /**
     * Get stored refresh token
     */
    public static function get_refresh_token() {
        return get_option('mira_verify_refresh_token', '');
    }

    /**
     * Get stored site ID
     */
    public static function get_site_id() {
        return get_option('mira_verify_site_id', '');
    }

    /**
     * Check if connected
     */
    public static function is_connected() {
        return !empty(self::get_access_token());
    }

    /**
     * Get OAuth authorize URL
     */
    public static function get_authorize_url() {
        if (!Mira_Verify::is_configured()) {
            return '';
        }

        $api_url = Mira_Verify::get_api_url();
        $redirect_uri = admin_url('options-general.php?page=mira-verify');
        $site_url = site_url();

        return add_query_arg(array(
            'redirect_uri' => urlencode($redirect_uri),
            'site_url' => urlencode($site_url),
        ), $api_url . '/oauth/authorize');
    }

    /**
     * Handle OAuth callback
     */
    public static function handle_callback() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $code = isset($_GET['code']) ? sanitize_text_field($_GET['code']) : '';

        if (empty($code)) {
            add_settings_error(
                'mira_verify',
                'oauth_error',
                __('Authorization failed: No code received.', 'mira-verify'),
                'error'
            );
            return;
        }

        $result = self::exchange_code($code);

        if (is_wp_error($result)) {
            add_settings_error(
                'mira_verify',
                'oauth_error',
                $result->get_error_message(),
                'error'
            );
            return;
        }

        add_settings_error(
            'mira_verify',
            'oauth_success',
            __('Successfully connected to Mira Verify!', 'mira-verify'),
            'success'
        );

        // Redirect to remove code from URL
        wp_safe_redirect(admin_url('options-general.php?page=mira-verify&connected=1'));
        exit;
    }

    /**
     * Exchange authorization code for tokens
     */
    private static function exchange_code($code) {
        if (!Mira_Verify::is_configured()) {
            return new WP_Error('not_configured', __('Service URL not configured.', 'mira-verify'));
        }

        $api_url = Mira_Verify::get_api_url();
        $redirect_uri = admin_url('options-general.php?page=mira-verify');

        $response = wp_remote_post($api_url . '/oauth/token', array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => wp_json_encode(array(
                'code' => $code,
                'redirect_uri' => $redirect_uri,
            )),
            'timeout' => 30,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($status_code !== 200) {
            $error_msg = isset($body['error_description']) ? $body['error_description'] : __('Token exchange failed.', 'mira-verify');
            return new WP_Error('token_error', $error_msg);
        }

        // Store tokens
        update_option('mira_verify_access_token', sanitize_text_field($body['access_token']));
        update_option('mira_verify_refresh_token', sanitize_text_field($body['refresh_token']));
        update_option('mira_verify_site_id', sanitize_text_field($body['site_id']));
        update_option('mira_verify_token_expires', time() + intval($body['expires_in']));

        return true;
    }

    /**
     * Refresh access token
     */
    public static function refresh_token() {
        $refresh_token = self::get_refresh_token();

        if (empty($refresh_token)) {
            return new WP_Error('no_refresh_token', __('No refresh token available.', 'mira-verify'));
        }

        if (!Mira_Verify::is_configured()) {
            return new WP_Error('not_configured', __('Service URL not configured.', 'mira-verify'));
        }

        $api_url = Mira_Verify::get_api_url();

        $response = wp_remote_post($api_url . '/oauth/refresh', array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body' => wp_json_encode(array(
                'refresh_token' => $refresh_token,
            )),
            'timeout' => 30,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($status_code !== 200) {
            // Refresh failed, disconnect
            self::disconnect();
            return new WP_Error('refresh_failed', __('Token refresh failed. Please reconnect.', 'mira-verify'));
        }

        update_option('mira_verify_access_token', sanitize_text_field($body['access_token']));
        update_option('mira_verify_refresh_token', sanitize_text_field($body['refresh_token']));
        update_option('mira_verify_token_expires', time() + intval($body['expires_in']));

        return true;
    }

    /**
     * Disconnect from Mira Verify
     */
    public static function disconnect() {
        $access_token = self::get_access_token();

        if (!empty($access_token) && Mira_Verify::is_configured()) {
            $api_url = Mira_Verify::get_api_url();

            // Try to revoke token on server
            wp_remote_post($api_url . '/oauth/revoke', array(
                'headers' => array(
                    'Authorization' => 'Bearer ' . $access_token,
                ),
                'timeout' => 10,
            ));
        }

        delete_option('mira_verify_access_token');
        delete_option('mira_verify_refresh_token');
        delete_option('mira_verify_site_id');
        delete_option('mira_verify_token_expires');
    }

    /**
     * AJAX handler for disconnect
     */
    public static function ajax_disconnect() {
        check_ajax_referer('mira_verify_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'mira-verify')));
        }

        self::disconnect();

        wp_send_json_success(array('message' => __('Disconnected successfully.', 'mira-verify')));
    }
}

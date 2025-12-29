<?php
/**
 * Verification result handler for Mira Verify
 */

if (!defined('ABSPATH')) {
    exit;
}

class Mira_Verify_Result {

    /**
     * Parse SSE event data
     */
    public static function parse_event($event_type, $data) {
        switch ($event_type) {
            case 'starting':
                return array(
                    'type' => 'starting',
                    'message' => __('Starting verification...', 'mira-verify'),
                );

            case 'extracting_claims':
                return array(
                    'type' => 'extracting_claims',
                    'message' => __('Extracting claims from content...', 'mira-verify'),
                );

            case 'claims_extracted':
                $count = isset($data['count']) ? intval($data['count']) : 0;
                return array(
                    'type' => 'claims_extracted',
                    'count' => $count,
                    'message' => sprintf(
                        _n('%d claim found.', '%d claims found.', $count, 'mira-verify'),
                        $count
                    ),
                );

            case 'verifying_claims':
                return array(
                    'type' => 'verifying_claims',
                    'message' => __('Verifying claims with multiple AI models...', 'mira-verify'),
                );

            case 'verifying_claim':
                $claim = isset($data['claim']) ? $data['claim'] : '';
                $index = isset($data['index']) ? intval($data['index']) + 1 : 1;
                $total = isset($data['total']) ? intval($data['total']) : 1;
                return array(
                    'type' => 'verifying_claim',
                    'claim' => $claim,
                    'index' => $index,
                    'total' => $total,
                    'message' => sprintf(
                        __('Verifying claim %d of %d...', 'mira-verify'),
                        $index,
                        $total
                    ),
                );

            case 'claim_verified':
                return array(
                    'type' => 'claim_verified',
                    'claim' => isset($data['claim']) ? $data['claim'] : '',
                    'assessment' => isset($data['assessment']) ? $data['assessment'] : 'UNKNOWN',
                    'models' => isset($data['models']) ? $data['models'] : array(),
                );

            case 'completed':
                return array(
                    'type' => 'completed',
                    'requestId' => isset($data['requestId']) ? $data['requestId'] : '',
                    'fact' => isset($data['fact']) ? $data['fact'] : '',
                    'results' => isset($data['results']) ? $data['results'] : array(),
                    'tokenUsage' => isset($data['tokenUsage']) ? $data['tokenUsage'] : array(),
                    'message' => __('Verification complete.', 'mira-verify'),
                );

            case 'error':
                return array(
                    'type' => 'error',
                    'message' => isset($data['message']) ? $data['message'] : __('An error occurred.', 'mira-verify'),
                );

            default:
                return array(
                    'type' => $event_type,
                    'data' => $data,
                );
        }
    }

    /**
     * Get assessment label
     */
    public static function get_assessment_label($assessment) {
        switch ($assessment) {
            case 'TRUE':
                return __('Verified True', 'mira-verify');
            case 'FALSE':
                return __('Verified False', 'mira-verify');
            case 'NO_CONSENSUS':
            case 'NO CONSENSUS':
                return __('No Consensus', 'mira-verify');
            default:
                return __('Unknown', 'mira-verify');
        }
    }

    /**
     * Get assessment CSS class
     */
    public static function get_assessment_class($assessment) {
        switch ($assessment) {
            case 'TRUE':
                return 'mira-verify-true';
            case 'FALSE':
                return 'mira-verify-false';
            case 'NO_CONSENSUS':
            case 'NO CONSENSUS':
                return 'mira-verify-no-consensus';
            default:
                return 'mira-verify-unknown';
        }
    }
}

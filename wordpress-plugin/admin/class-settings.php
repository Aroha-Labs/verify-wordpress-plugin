<?php
/**
 * Settings page for Mira Verify
 */

if (!defined('ABSPATH')) {
    exit;
}

class Mira_Verify_Settings {

    /**
     * Register plugin settings
     */
    public static function register_settings() {
        register_setting('mira_verify_settings', 'mira_verify_api_url', array(
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => '',
        ));

        add_settings_section(
            'mira_verify_main',
            __('Configuration', 'mira-verify'),
            array(__CLASS__, 'render_section_description'),
            'mira-verify'
        );

        add_settings_field(
            'mira_verify_api_url',
            __('Service URL', 'mira-verify'),
            array(__CLASS__, 'render_api_url_field'),
            'mira-verify',
            'mira_verify_main'
        );
    }

    /**
     * Render section description
     */
    public static function render_section_description() {
        echo '<p>' . esc_html__('Configure your Mira Verify connection.', 'mira-verify') . '</p>';
    }

    /**
     * Render API URL field
     */
    public static function render_api_url_field() {
        $api_url = get_option('mira_verify_api_url', '');
        ?>
        <input
            type="url"
            id="mira_verify_api_url"
            name="mira_verify_api_url"
            value="<?php echo esc_attr($api_url); ?>"
            class="regular-text"
            placeholder="https://verify.miranet.work"
        />
        <p class="description">
            <?php esc_html_e('Your Mira Verify service URL (e.g., https://verify.miranet.work)', 'mira-verify'); ?>
        </p>
        <?php
    }

    /**
     * Render settings page
     */
    public static function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $is_configured = Mira_Verify::is_configured();
        $is_connected = Mira_Verify_OAuth::is_connected();

        // Handle messages
        if (isset($_GET['connected']) && $_GET['connected'] === '1') {
            add_settings_error(
                'mira_verify',
                'connected',
                __('Successfully connected to Mira Verify!', 'mira-verify'),
                'success'
            );
        }

        settings_errors('mira_verify');
        ?>
        <div class="wrap mira-verify-settings">
            <div class="mira-verify-header">
                <img src="<?php echo esc_url(MIRA_VERIFY_PLUGIN_URL . 'assets/images/logo.svg'); ?>" alt="Mira" class="mira-verify-logo" />
                <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            </div>

            <?php if (!$is_configured): ?>
                <!-- Configuration Required -->
                <div class="mira-verify-card">
                    <h2><?php esc_html_e('Setup Required', 'mira-verify'); ?></h2>
                    <p><?php esc_html_e('Please configure your Mira Verify service URL to get started.', 'mira-verify'); ?></p>

                    <form method="post" action="options.php">
                        <?php
                        settings_fields('mira_verify_settings');
                        do_settings_sections('mira-verify');
                        submit_button(__('Save Settings', 'mira-verify'));
                        ?>
                    </form>
                </div>

            <?php elseif (!$is_connected): ?>
                <!-- Not Connected -->
                <div class="mira-verify-card">
                    <h2><?php esc_html_e('Connect to Mira Verify', 'mira-verify'); ?></h2>
                    <p><?php esc_html_e('Connect your WordPress site to your Mira Verify account to start verifying content.', 'mira-verify'); ?></p>

                    <p>
                        <a href="<?php echo esc_url(Mira_Verify_OAuth::get_authorize_url()); ?>" class="button button-primary button-hero">
                            <?php esc_html_e('Connect to Mira Verify', 'mira-verify'); ?>
                        </a>
                    </p>
                </div>

                <!-- Settings -->
                <div class="mira-verify-card">
                    <h2><?php esc_html_e('Settings', 'mira-verify'); ?></h2>
                    <form method="post" action="options.php">
                        <?php
                        settings_fields('mira_verify_settings');
                        do_settings_sections('mira-verify');
                        submit_button(__('Save Settings', 'mira-verify'));
                        ?>
                    </form>
                </div>

            <?php else: ?>
                <!-- Connected -->
                <?php $status = Mira_Verify_API::get_status(); ?>

                <div class="mira-verify-card mira-verify-connected">
                    <h2>
                        <span class="dashicons dashicons-yes-alt"></span>
                        <?php esc_html_e('Connected', 'mira-verify'); ?>
                    </h2>

                    <?php if (!is_wp_error($status)): ?>
                        <table class="mira-verify-status-table">
                            <tr>
                                <th><?php esc_html_e('Site', 'mira-verify'); ?></th>
                                <td><?php echo esc_html($status['site']['domain']); ?></td>
                            </tr>
                            <?php if (isset($status['subscription'])): ?>
                                <tr>
                                    <th><?php esc_html_e('Plan', 'mira-verify'); ?></th>
                                    <td><?php echo esc_html($status['subscription']['plan']); ?></td>
                                </tr>
                                <tr>
                                    <th><?php esc_html_e('Usage', 'mira-verify'); ?></th>
                                    <td>
                                        <?php
                                        echo esc_html(sprintf(
                                            __('%d / %d verifications', 'mira-verify'),
                                            $status['subscription']['verificationsUsed'],
                                            $status['subscription']['verificationsLimit']
                                        ));
                                        ?>
                                    </td>
                                </tr>
                                <tr>
                                    <th><?php esc_html_e('Status', 'mira-verify'); ?></th>
                                    <td>
                                        <span class="mira-verify-status-badge mira-verify-status-<?php echo esc_attr($status['subscription']['status']); ?>">
                                            <?php echo esc_html(ucfirst($status['subscription']['status'])); ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </table>
                    <?php else: ?>
                        <p class="mira-verify-error">
                            <?php echo esc_html($status->get_error_message()); ?>
                        </p>
                    <?php endif; ?>

                    <p class="mira-verify-actions">
                        <button type="button" class="button" id="mira-verify-disconnect">
                            <?php esc_html_e('Disconnect', 'mira-verify'); ?>
                        </button>
                    </p>
                </div>

                <!-- How to Use -->
                <div class="mira-verify-card">
                    <h2><?php esc_html_e('How to Use', 'mira-verify'); ?></h2>
                    <ol>
                        <li><?php esc_html_e('Open any post or page in the block editor.', 'mira-verify'); ?></li>
                        <li><?php esc_html_e('Click the "Verify Content" button in the top toolbar.', 'mira-verify'); ?></li>
                        <li><?php esc_html_e('Wait for the AI models to analyze your content.', 'mira-verify'); ?></li>
                        <li><?php esc_html_e('Review the verification results for each claim.', 'mira-verify'); ?></li>
                    </ol>
                </div>

                <!-- Settings -->
                <div class="mira-verify-card">
                    <h2><?php esc_html_e('Settings', 'mira-verify'); ?></h2>
                    <form method="post" action="options.php">
                        <?php
                        settings_fields('mira_verify_settings');
                        do_settings_sections('mira-verify');
                        submit_button(__('Save Settings', 'mira-verify'));
                        ?>
                    </form>
                </div>

                <script>
                document.getElementById('mira-verify-disconnect').addEventListener('click', function() {
                    if (!confirm('<?php echo esc_js(__('Are you sure you want to disconnect?', 'mira-verify')); ?>')) {
                        return;
                    }

                    var data = new FormData();
                    data.append('action', 'mira_verify_disconnect');
                    data.append('nonce', '<?php echo wp_create_nonce('mira_verify_nonce'); ?>');

                    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        body: data
                    })
                    .then(function(response) { return response.json(); })
                    .then(function(result) {
                        if (result.success) {
                            window.location.reload();
                        } else {
                            alert(result.data.message || 'Failed to disconnect');
                        }
                    })
                    .catch(function(error) {
                        alert('An error occurred');
                    });
                });
                </script>
            <?php endif; ?>
        </div>
        <?php
    }
}

<?php
/**
 * Plugin Name: Mira Verify
 * Plugin URI: https://miranet.work
 * Description: Verify your content with AI-powered fact checking using multi-model consensus.
 * Version: 1.0.0
 * Author: Mira Network
 * Author URI: https://miranet.work
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: mira-verify
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MIRA_VERIFY_VERSION', '1.0.1');
define('MIRA_VERIFY_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MIRA_VERIFY_PLUGIN_URL', plugin_dir_url(__FILE__));

class Mira_Verify {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    private function load_dependencies() {
        require_once MIRA_VERIFY_PLUGIN_DIR . 'includes/class-oauth.php';
        require_once MIRA_VERIFY_PLUGIN_DIR . 'includes/class-api.php';
        require_once MIRA_VERIFY_PLUGIN_DIR . 'includes/class-verify.php';
        require_once MIRA_VERIFY_PLUGIN_DIR . 'admin/class-settings.php';
        require_once MIRA_VERIFY_PLUGIN_DIR . 'admin/class-editor.php';
    }

    private function init_hooks() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array('Mira_Verify_Settings', 'register_settings'));
        add_action('admin_init', array($this, 'handle_oauth_callback'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));

        add_action('wp_ajax_mira_verify_content', array('Mira_Verify_API', 'ajax_verify_content'));
        add_action('wp_ajax_mira_verify_disconnect', array('Mira_Verify_OAuth', 'ajax_disconnect'));
        add_action('wp_ajax_mira_verify_status', array('Mira_Verify_API', 'ajax_get_status'));

        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }

    public function add_admin_menu() {
        add_options_page(
            __('Mira Verify', 'mira-verify'),
            __('Mira Verify', 'mira-verify'),
            'manage_options',
            'mira-verify',
            array('Mira_Verify_Settings', 'render_settings_page')
        );
    }

    public function handle_oauth_callback() {
        if (isset($_GET['page']) && $_GET['page'] === 'mira-verify' && isset($_GET['code'])) {
            Mira_Verify_OAuth::handle_callback();
        }
    }

    public function enqueue_admin_assets($hook) {
        if ($hook !== 'settings_page_mira-verify') {
            return;
        }

        wp_enqueue_style(
            'mira-verify-admin',
            MIRA_VERIFY_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            MIRA_VERIFY_VERSION
        );
    }

    public function enqueue_editor_assets() {
        if (!Mira_Verify_OAuth::is_connected()) {
            return;
        }

        wp_enqueue_script(
            'mira-verify-editor',
            MIRA_VERIFY_PLUGIN_URL . 'assets/js/editor.js',
            array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-compose'),
            MIRA_VERIFY_VERSION,
            true
        );

        wp_localize_script('mira-verify-editor', 'miraVerify', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('mira_verify_nonce'),
            'dashboardUrl' => self::get_dashboard_url(),
        ));

        wp_enqueue_style(
            'mira-verify-editor',
            MIRA_VERIFY_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            MIRA_VERIFY_VERSION
        );
    }

    public static function get_base_url() {
        return rtrim(get_option('mira_verify_api_url', ''), '/');
    }

    public static function get_api_url() {
        return self::get_base_url() . '/v1/wp';
    }

    public static function get_dashboard_url() {
        return self::get_base_url();
    }

    public static function is_configured() {
        $base_url = self::get_base_url();
        return !empty($base_url) && filter_var($base_url, FILTER_VALIDATE_URL);
    }

    public function activate() {
        add_option('mira_verify_api_url', '');
    }

    public function deactivate() {
        // Keep settings on deactivation
    }
}

function mira_verify() {
    return Mira_Verify::get_instance();
}

add_action('plugins_loaded', 'mira_verify');

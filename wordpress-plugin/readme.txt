=== Mira Verify ===
Contributors: miranetwork
Tags: fact-check, ai, verification, content, gutenberg
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

AI-powered fact verification for WordPress using multi-model consensus.

== Description ==

Mira Verify brings AI-powered fact-checking directly to your WordPress editor. Using multi-model consensus verification, it analyzes claims in your content and provides transparent, auditable verification results.

**How It Works**

1. Write your content in the WordPress block editor
2. Click the "Verify Content" button in the toolbar
3. AI models independently analyze factual claims
4. See verification results with consensus indicators

**Key Features**

* **Multi-Model Verification** - Multiple AI models independently verify claims, eliminating single-model bias
* **Consensus-Based Results** - Claims are marked as verified only when models agree
* **Real-Time Feedback** - Watch verification progress as claims are analyzed
* **Seamless Integration** - Works directly in the WordPress block editor
* **Verification History** - Track all verifications in your dashboard

**Requirements**

This plugin requires a Mira Verify subscription. Plans start at $19/month for 100 verifications.

* [View Pricing](https://verify-wp.mira.network/pricing)
* [Create Account](https://verify-wp.mira.network/register)

== Installation ==

1. Upload the `mira-verify` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Settings > Mira Verify
4. Click "Connect to Mira Verify" to link your account
5. Start verifying content in the block editor

== Frequently Asked Questions ==

= Do I need an account to use this plugin? =

Yes, Mira Verify requires a subscription to access the verification API. You can create an account at [verify-wp.mira.network](https://verify-wp.mira.network/register).

= What AI models are used for verification? =

Mira Verify uses multiple leading AI models to independently assess claims. The specific models may vary but always include at least 3 models to ensure consensus-based results.

= How are verifications counted? =

Each time you click "Verify Content" counts as one verification, regardless of how many claims are in your content.

= Can I verify content before publishing? =

Yes! The verify button works on drafts, allowing you to check facts before publishing.

= What types of claims can be verified? =

Mira Verify works best with factual claims - statistics, dates, scientific facts, and verifiable statements. It may not be suitable for opinions, predictions, or highly specialized domain knowledge.

= Is my content stored? =

Content is processed for verification only and is not permanently stored. Verification results are saved to your history for reference.

== Screenshots ==

1. Plugin settings page showing connection status
2. Verify Content button in the block editor toolbar
3. Verification results showing claim assessments

== Changelog ==

= 1.0.1 =
* Initial public release
* Multi-model consensus verification
* Real-time SSE streaming for progress updates
* WordPress block editor integration
* OAuth-based account connection

== Upgrade Notice ==

= 1.0.1 =
Initial release of Mira Verify for WordPress.

# Mira Verify

[![License: GPL v2+](https://img.shields.io/badge/License-GPL%20v2%2B-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

AI-powered fact verification for WordPress using multi-model consensus.

## Overview

Mira Verify brings AI-powered fact-checking directly to the WordPress editor. Using multi-model consensus verification, it analyzes claims in your content and provides transparent, auditable verification results.

### Key Features

- **Multi-Model Verification** - Multiple AI models independently verify claims, eliminating single-model bias
- **Consensus-Based Results** - Claims are marked as verified only when models agree
- **Real-Time Feedback** - Watch verification progress as claims are analyzed
- **Seamless Integration** - Works directly in the WordPress block editor
- **Verification History** - Track all verifications in your dashboard

## Architecture

This monorepo contains three components:

```
├── api/                 # Cloudflare Worker backend
├── dashboard/           # React + TypeScript user portal
└── wordpress-plugin/    # WordPress plugin
```

| Component | Description | Tech Stack |
|-----------|-------------|------------|
| **API** | Backend service handling verification requests, authentication, and Stripe billing | Hono, Cloudflare Workers, D1, Better Auth |
| **Dashboard** | User portal for managing subscription, sites, and viewing verification history | React, TypeScript, Vite, TanStack Router |
| **WordPress Plugin** | Block editor integration with OAuth connection to dashboard | PHP, WordPress Block Editor API |

## Installation

### WordPress Plugin

1. Download the latest release from [GitHub Releases](https://github.com/Aroha-Labs/verify-wordpress-plugin/releases)
2. Upload the `mira-verify` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Go to **Settings > Mira Verify**
5. Click "Connect to Mira Verify" to link your account

Or download directly: [verify-wp.mira.network/v1/download/plugin](https://verify-wp.mira.network/v1/download/plugin)

### Requirements

- WordPress 5.8+
- PHP 7.4+
- A Mira Verify subscription ([pricing](https://verify-wp.mira.network/pricing))

## Live Services

- **Dashboard**: [verify-wp.mira.network](https://verify-wp.mira.network)
- **API**: verify-wp.mira.network/v1

## Development

### API

```bash
cd api
npm install
npm run dev
```

Requires Cloudflare Wrangler. See [api/README.md](./api/README.md) for details.

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

### WordPress Plugin

The plugin can be tested in any local WordPress installation. Copy the `wordpress-plugin` folder to `wp-content/plugins/mira-verify`.

## Contributing

Contributions are welcome! Please open an issue to discuss proposed changes before submitting a pull request.

## License

This project is licensed under the GNU General Public License v2.0 or later - see the [LICENSE](LICENSE) file for details.

## Links

- [Create Account](https://verify-wp.mira.network/register)
- [View Pricing](https://verify-wp.mira.network/pricing)
- [Report Issues](https://github.com/Aroha-Labs/verify-wordpress-plugin/issues)

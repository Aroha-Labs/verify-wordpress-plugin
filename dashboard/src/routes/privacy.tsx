import { Link } from "@tanstack/react-router";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <title>Privacy Policy - FactPress</title>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid #E8E8E8' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/FactPressLogo-black.svg" alt="" className="h-5" />
          <span style={{ fontFamily: 'Geist, sans-serif', fontWeight: 500, fontSize: '18px' }}>
            FactPress
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h1
            className="mb-2"
            style={{
              fontFamily: 'Geist, sans-serif',
              fontWeight: 600,
              fontSize: '32px',
              color: '#18181B'
            }}
          >
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p className="text-gray-600 mb-6">
              This Privacy Policy describes how Mira Network ("we", "us", or "our") collects, uses,
              and shares information when you use FactPress ("Service").
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Information We Collect
            </h2>

            <h3 className="text-lg font-medium mt-6 mb-3">Account Information</h3>
            <p className="text-gray-600 mb-4">
              When you sign in with Google, we receive your name and email address from Google.
              We use this information to create and manage your account.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">WordPress Site Information</h3>
            <p className="text-gray-600 mb-4">
              When you connect your WordPress site to FactPress, we store your site's URL to
              enable the verification service.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">Content for Verification</h3>
            <p className="text-gray-600 mb-4">
              When you use the verification feature, the text content you submit is sent to our
              AI models for fact-checking. We process this content to provide verification results
              and may retain verification history for your reference.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">Payment Information</h3>
            <p className="text-gray-600 mb-4">
              Payment processing is handled by Stripe. We do not store your credit card details.
              Stripe's use of your information is governed by their{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">Usage Data</h3>
            <p className="text-gray-600 mb-4">
              We collect information about how you use the Service, including verification counts
              and feature usage, to improve our Service and enforce usage limits.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>To provide, maintain, and improve the Service</li>
              <li>To process your transactions and manage your subscription</li>
              <li>To communicate with you about the Service</li>
              <li>To enforce our Terms of Service and usage limits</li>
              <li>To protect against fraud and abuse</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Third-Party Services
            </h2>
            <p className="text-gray-600 mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Google OAuth</strong> - for authentication</li>
              <li><strong>Stripe</strong> - for payment processing</li>
              <li><strong>Cloudflare</strong> - for hosting and security</li>
              <li><strong>AI Models</strong> - for content verification (via Mira Network)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Data Retention
            </h2>
            <p className="text-gray-600 mb-6">
              We retain your account information for as long as your account is active.
              Verification history is retained to provide you with access to past results.
              You may request deletion of your account and associated data by contacting us.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Data Security
            </h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your
              information. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Your Rights
            </h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Changes to This Policy
            </h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@factpress.ai" className="text-blue-600 hover:underline">
                hello@factpress.ai
              </a>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 flex justify-center">
        <img
          src="/powered-by-mira.svg"
          alt="powered by mira"
          style={{ opacity: 0.4 }}
        />
      </footer>
    </div>
  );
}

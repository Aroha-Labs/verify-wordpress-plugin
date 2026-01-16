import { Link } from "@tanstack/react-router";

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <title>Terms of Service - FactPress</title>

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
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p className="text-gray-600 mb-6">
              These Terms of Service ("Terms") govern your use of FactPress ("Service") operated
              by Mira Network ("we", "us", or "our"). By using the Service, you agree to these Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              1. Description of Service
            </h2>
            <p className="text-gray-600 mb-6">
              FactPress is an AI-powered fact-checking service for WordPress. The Service uses
              multiple AI models to analyze text content and identify potentially inaccurate
              or misleading statements. The Service is provided as a tool to assist content
              creators and does not guarantee the accuracy of its results.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              2. Account Registration
            </h2>
            <p className="text-gray-600 mb-6">
              To use the Service, you must sign in with a Google account. You are responsible
              for maintaining the security of your account and for all activities that occur
              under your account.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              3. Subscription and Payment
            </h2>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>The Service is offered on a subscription basis at $10 per week</li>
              <li>Each subscription includes 100 verifications per week</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You may cancel your subscription at any time through the dashboard</li>
              <li>All fees are non-refundable</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              4. Acceptable Use
            </h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to circumvent usage limits or security measures</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Submit content that infringes on intellectual property rights</li>
              <li>Use the Service to generate or verify deliberately false content</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              5. Limitations of the Service
            </h2>
            <p className="text-gray-600 mb-4">
              <strong>Important:</strong> The Service is an AI-powered tool and has inherent limitations:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>AI models may produce inaccurate or incomplete results</li>
              <li>The Service should not be the sole basis for publishing decisions</li>
              <li>Results may vary between different verification requests</li>
              <li>The Service does not guarantee factual accuracy of any content</li>
              <li>You remain solely responsible for the content you publish</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              6. Intellectual Property
            </h2>
            <p className="text-gray-600 mb-6">
              The Service, including its design, features, and content, is owned by Mira Network
              and protected by intellectual property laws. You retain ownership of the content
              you submit for verification.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              7. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600 mb-6">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              8. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-6">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MIRA NETWORK SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA,
              USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              9. Termination
            </h2>
            <p className="text-gray-600 mb-6">
              We may terminate or suspend your access to the Service at any time, with or without
              cause, with or without notice. Upon termination, your right to use the Service will
              immediately cease.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              10. Changes to Terms
            </h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify these Terms at any time. We will notify you of any
              changes by posting the new Terms on this page and updating the "Last updated" date.
              Your continued use of the Service after any changes constitutes acceptance of the
              new Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              11. Governing Law
            </h2>
            <p className="text-gray-600 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of
              Singapore, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              12. Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              If you have questions about these Terms, please contact us at{" "}
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

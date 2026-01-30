import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";

export function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <title>FactPress - AI-Powered Fact-Checking for WordPress</title>

      {/* Hero Section with Header - Full Screen Height */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: 'url(/hero-pattern.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
        }}
      >
        {/* Top fade overlay */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: '65px',
            height: '120px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
        {/* Bottom fade overlay (double intensity) */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '240px',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0) 100%)',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
        {/* Header */}
        <header className="bg-white relative" style={{ borderBottom: '1px solid #E8E8E8', zIndex: 10 }}>
          <div className="mx-auto flex h-16 items-center justify-between px-6" style={{ maxWidth: '1056px' }}>
            <Link to="/" className="flex items-center gap-1">
              <img src="/factpress-logo.svg" alt="FactPress" className="h-6" />
              <div className="hidden md:flex items-center gap-1 opacity-50">
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#18181B',
                  }}
                >
                  powered by
                </span>
                <img src="/mira-logo-text.svg" alt="mira" className="h-[7px]" />
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <a
                href="#pricing"
                className="hidden md:block hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#18181B',
                }}
              >
                Pricing
              </a>
              <a
                href="#features"
                className="hidden md:block hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#18181B',
                }}
              >
                Features
              </a>
              {session?.user ? (
                <Link
                  to="/dashboard"
                  className="hover:opacity-90 transition-opacity"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: 'white',
                    backgroundColor: '#18181B',
                    borderRadius: '100px',
                    padding: '6px 16px',
                  }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="hover:opacity-70 transition-opacity"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#18181B',
                    border: '2px solid #18181B',
                    borderRadius: '16px',
                    padding: '4px 16px',
                  }}
                >
                  Log in
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Content - Bottom Left Aligned */}
        <div className="flex-1 flex items-end relative" style={{ paddingBottom: '96px', zIndex: 10 }}>
          <div className="mx-auto w-full" style={{ maxWidth: '1056px', padding: '0 24px' }}>
            {/* Mobile: Powered by Mira badge */}
            <div className="flex md:hidden justify-end">
              <div
                className="flex items-center gap-1"
                style={{
                  backgroundColor: '#F0F0F0',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <span
                  className="opacity-40"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#18181B',
                  }}
                >
                  powered by
                </span>
                <img src="/mira-icon.svg" alt="" className="h-[12px] opacity-40" />
                <img src="/mira-logo-text.svg" alt="mira" className="h-[7px] opacity-40" />
              </div>
            </div>
            <div
              style={{
                maxWidth: '723px',
                backgroundColor: 'white',
                padding: '24px',
              }}
            >
              <h1
                className="tracking-tight leading-tight"
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: 500,
                  fontSize: '32px',
                  color: '#18181B',
                }}
              >
                AI-Powered Fact-Checking, Right in WordPress
              </h1>
              <p
                className="mt-6"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#18181BCC',
                }}
              >
                Verify claims before you publish. FactPress checks your content across multiple
                AI models and flags inaccurate or risky statements right inside WordPress.
              </p>
              <div className="mt-8">
                <Link
                  to="/dashboard"
                  className="inline-block hover:opacity-90 transition-opacity"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: 'white',
                    backgroundColor: '#18181B',
                    borderRadius: '100px',
                    padding: '6px 16px',
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="mx-auto px-6" style={{ maxWidth: '1056px' }}>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: 500,
                  fontSize: '32px',
                  color: '#18181B',
                }}
              >
                Publish with confidence, every time
              </h2>
              <p
                className="mt-4"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#18181BCC',
                }}
              >
                FactPress evaluates claims in your content using multiple independent AI models. Only when all
                models agree is a fact marked as verified, giving you higher confidence and fewer single-model errors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature Card 1 - Multi-Model Evaluation */}
              <div
                className="rounded-xl border border-[#DADADA] overflow-hidden flex flex-col"
                style={{
                  backgroundImage: 'url(/gradient-1.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ height: '240px' }}
                >
                  <img
                    src="/feature-multi-model.svg"
                    alt="Multi-Model Evaluation"
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
                <div className="bg-white p-6 text-center flex-1">
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '20px',
                      color: '#18181B',
                      lineHeight: '100%',
                    }}
                  >
                    Multi-Model Evaluation
                  </h3>
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#18181B80',
                      lineHeight: 1.2,
                      textAlign: 'center',
                    }}
                  >
                    Each fact in your article is independently checked across multiple AI models, reducing
                    hallucinations and single-model bias.
                  </p>
                </div>
              </div>

              {/* Feature Card 2 - Consensus Based Results */}
              <div
                className="rounded-xl border border-[#DADADA] overflow-hidden flex flex-col"
                style={{
                  backgroundImage: 'url(/gradient-2.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ height: '240px' }}
                >
                  <img
                    src="/feature-consensus.svg"
                    alt="Consensus Based Results"
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
                <div className="bg-white p-6 text-center flex-1">
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '20px',
                      color: '#18181B',
                      lineHeight: '100%',
                    }}
                  >
                    Consensus Based Results
                  </h3>
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#18181B80',
                      lineHeight: 1.2,
                      textAlign: 'center',
                    }}
                  >
                    Facts are only marked as verified when models independently reach agreement,
                    giving you higher confidence in every check.
                  </p>
                </div>
              </div>

              {/* Feature Card 3 - Built for WordPress */}
              <div
                className="rounded-xl border border-[#DADADA] overflow-hidden flex flex-col"
                style={{
                  backgroundImage: 'url(/gradient-3.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{ height: '240px' }}
                >
                  <img
                    src="/feature-wordpress.svg"
                    alt="Built for WordPress"
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
                <div className="bg-white p-6 text-center flex-1">
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '20px',
                      color: '#18181B',
                      lineHeight: '100%',
                    }}
                  >
                    Built for WordPress
                  </h3>
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#18181B80',
                      lineHeight: 1.2,
                      textAlign: 'center',
                    }}
                  >
                    Run verifications directly from your WordPress editor, no copy-paste
                    workflows or external tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white scroll-mt-16">
          <div className="mx-auto px-6 text-center" style={{ maxWidth: '1056px' }}>
            <h2
              className="flex items-center justify-center flex-wrap gap-3"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
                fontSize: '32px',
                color: '#18181B',
              }}
            >
              <span>Publish with confidence, at just</span>
              <img src="/text-10$-week.svg" alt="$10/week" className="h-[40px]" />
            </h2>
            <p
              className="mt-4 max-w-xl mx-auto"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                color: '#18181BCC',
              }}
            >
              Join writers and publishers who verify up to 100 verifications every
              week with FactPress
            </p>
            <div className="mt-8">
              <Link
                to="/dashboard"
                className="inline-block hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: 'white',
                  backgroundColor: '#18181B',
                  borderRadius: '100px',
                  padding: '12px 32px',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative"
        style={{
          backgroundImage: 'url(/desktop-footer.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          padding: '74px 0',
        }}
      >
        <div className="mx-auto px-6 flex flex-col-reverse md:flex-row items-start md:items-center md:justify-between gap-6" style={{ maxWidth: '1056px' }}>
          {/* Powered by Mira - left on desktop, bottom on mobile */}
          <img src="/powered-by-mira.svg" alt="Powered by Mira" className="h-5" style={{ opacity: 0.6 }} />
          {/* Links and Contact - right on desktop, top on mobile */}
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="hover:opacity-70 transition-opacity"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#18181B',
              }}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:opacity-70 transition-opacity"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#18181B',
              }}
            >
              Terms
            </Link>
            <a
              href="mailto:hello@factpress.ai"
              className="hover:opacity-70 transition-opacity"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#18181B',
              }}
            >
              Contact
            </a>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <a
              href="mailto:hello@factpress.ai"
              className="hover:opacity-70 transition-opacity"
              aria-label="Email us"
            >
              <img src="/icons/mail.svg" alt="Email" className="h-5 w-5" />
            </a>
            <a
              href="https://discord.gg/mira"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="Join our Discord"
            >
              <img src="/icons/discord.svg" alt="Discord" className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

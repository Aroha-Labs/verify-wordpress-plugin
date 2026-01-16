import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Mail } from "lucide-react";

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
              <a
                href="mailto:hello@mira.network"
                className="hidden md:block hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#18181B',
                }}
              >
                Contact
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
                  to="/login"
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
                  to="/register"
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
              <div className="rounded-xl border border-[#DADADA] overflow-hidden">
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: '240px',
                    background: 'linear-gradient(148.39deg, #DCF0FB 30.13%, #DBEEFC 38.03%, #B2DCF4 44.73%, #C3E4C7 51.23%, #90D8CC 56.53%, #9AD9C9 64.28%, #98D6A5 75.31%, #CFCC80 95.07%)',
                  }}
                >
                  <img
                    src="/feature-multi-model.svg"
                    alt="Multi-Model Evaluation"
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
                <div className="bg-white p-6 text-center">
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
              <div className="rounded-xl border border-[#DADADA] overflow-hidden">
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: '240px',
                    background: 'radial-gradient(70.34% 47.14% at 63.34% 52.64%, #F8BFF2 1.98%, #F79AA7 45.61%, #FBC5A6 71.89%, #AACE8A 100%)',
                  }}
                >
                  <img
                    src="/feature-consensus.svg"
                    alt="Consensus Based Results"
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
                <div className="bg-white p-6 text-center">
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
              <div className="rounded-xl border border-[#DADADA] overflow-hidden">
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: '240px',
                    backgroundImage: 'url(/featured-card-3.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <img
                    src="/feature-wordpress.svg"
                    alt="Built for WordPress"
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
                <div className="bg-white p-6 text-center">
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
            {/* $10/week SVG */}
            <div className="flex justify-center mb-6">
              <img src="/text-10$-week.svg" alt="$10/week" className="h-[61px]" />
            </div>

            <h2
              style={{
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
                fontSize: '32px',
                color: '#18181B',
              }}
            >
              Publish with confidence—100 verifications every week
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
              Join writers and publishers who verify their content with FactPress
              with 100 verifications/week
            </p>
            <div className="mt-8">
              <Link
                to="/register"
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
        <div className="mx-auto px-6 flex items-center justify-between" style={{ maxWidth: '1056px' }}>
          <div className="flex items-center gap-2">
            <img src="/powered-by-mira.svg" alt="Powered by Mira" className="h-5" />
          </div>
          <div className="flex items-center gap-4">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: '#18181B',
              }}
            >
              contact
            </span>
            <a
              href="mailto:hello@mira.network"
              className="hover:opacity-70 transition-opacity"
              aria-label="Email us"
              style={{ color: '#000000' }}
            >
              <Mail className="h-5 w-5" fill="currentColor" />
            </a>
            <a
              href="https://discord.gg/mira"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="Join our Discord"
              style={{ color: '#000000' }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

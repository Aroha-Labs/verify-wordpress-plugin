import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { CheckCircle, Shield, Zap } from "lucide-react";

function MiraLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.947 3.28332L21.9761 0.884766L32.1155 15.958L28.4941 18.13V23.1536H27.7694L17.947 8.53343V3.28332Z" fill="currentColor"/>
      <path d="M9.393 7.7657L13.4221 5.36715L23.5615 20.4403L19.9401 22.6124V27.636H19.2153L9.393 13.0158V7.7657Z" fill="currentColor"/>
      <path d="M0.884277 12.2457L4.91335 9.84715L15.0528 24.9203L11.4314 27.0924V32.116H10.7066L0.884277 17.4958V12.2457Z" fill="currentColor"/>
    </svg>
  );
}

export function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <title>Mira Verify - AI-Powered Fact Verification for WordPress</title>
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MiraLogo className="h-7 w-7" />
            <span className="text-lg font-semibold">Mira Verify</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            {session?.user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="container relative py-24 md:py-32 text-center">
            <div className="mx-auto mb-8 flex justify-center">
              <MiraLogo className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              AI-Powered Fact Verification
              <br />
              <span className="text-slate-400">for WordPress</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Verify your content with multi-model AI consensus before publishing.
              Build trust with your readers through transparent, auditable verification.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="ghost" className="border border-slate-600 text-white hover:bg-slate-800 hover:text-white" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-background">
          <div className="container">
            <h2 className="text-center text-3xl font-bold">How It Works</h2>
            <p className="text-center mt-4 text-muted-foreground max-w-2xl mx-auto">
              Mira Verify uses multiple AI models to independently assess claims in your content,
              ensuring accuracy through consensus.
            </p>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="relative p-6 rounded-lg border bg-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Multi-Model Verification</h3>
                <p className="mt-2 text-muted-foreground">
                  Multiple AI models independently verify your content for accuracy, eliminating single-model bias.
                </p>
              </div>
              <div className="relative p-6 rounded-lg border bg-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Consensus-Based Results</h3>
                <p className="mt-2 text-muted-foreground">
                  Claims are only marked as verified when multiple models agree, ensuring higher confidence.
                </p>
              </div>
              <div className="relative p-6 rounded-lg border bg-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">WordPress Integration</h3>
                <p className="mt-2 text-muted-foreground">
                  One-click verification right from your WordPress editor. No workflow changes needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-950 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold">Ready to verify your content?</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Join content creators who trust Mira Verify to ensure accuracy in their publications.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MiraLogo className="h-5 w-5" />
            <span>Powered by Mira Network</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://mira.network" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              mira.network
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

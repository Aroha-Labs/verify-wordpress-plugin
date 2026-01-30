import { useState } from "react";
import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useSession, signOut, signIn } from "@/lib/auth-client";
import { getCurrentSubscription, getPlans, createCheckout, getSites } from "@/lib/api";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FlaskConical, Globe, BarChart3, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/playground", label: "Playground", icon: FlaskConical },
  { href: "/dashboard/sites", label: "Sites", icon: Globe },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function LoginUI({ returnUrl }: { returnUrl?: string | null }) {
  const handleSignIn = () => {
    // Save return URL to sessionStorage so it persists through Google OAuth
    if (returnUrl) {
      sessionStorage.setItem("oauth_return_url", returnUrl);
    }
    signIn.social({ provider: "google" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <title>Get Started - FactPress</title>

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
        <Button
          variant="outline"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            borderRadius: '100px',
            paddingLeft: '16px',
            paddingRight: '16px'
          }}
        >
          Log in
        </Button>
      </header>

      {/* Main Content - centered */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Checkmark icon */}
          <img
            src="/FactPressLogo-black.svg"
            alt=""
            className="mx-auto mb-6"
            style={{ height: '48px' }}
          />

          {/* Title */}
          <h1
            className="mb-2"
            style={{
              fontFamily: 'Geist, sans-serif',
              fontWeight: 600,
              fontSize: '28px',
              color: '#18181B'
            }}
          >
            Get Started with FactPress
          </h1>

          {/* Subtitle */}
          <p
            className="mb-8"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: '#6B7280'
            }}
          >
            Sign in to use the plugin
          </p>

          {/* Google Sign In Button */}
          <Button
            onClick={handleSignIn}
            className="mb-4"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              backgroundColor: '#18181B',
              color: 'white',
              borderRadius: '8px',
              width: '280px',
              height: '48px'
            }}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </Button>

          {/* Helper text */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#9CA3AF'
            }}
          >
            No email spam. Used only for account access.
          </p>
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

function SubscriptionUI({ user }: { user: { name?: string | null; image?: string | null } }) {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const isCanceled = new URLSearchParams(location.search).get("canceled") === "true";

  const handleContinueToPayment = async () => {
    setIsLoading(true);
    try {
      const plans = await getPlans();
      // Find the first plan (should be the $10/week plan)
      const plan = plans[0];
      if (plan?.stripePriceId) {
        const { url } = await createCheckout(plan.stripePriceId);
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create checkout:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <title>Subscribe - FactPress</title>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #E8E8E8" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/FactPressLogo-black.svg" alt="" className="h-5" />
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: "18px",
            }}
          >
            FactPress
          </span>
        </Link>
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white overflow-hidden">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div
          className="w-full flex"
          style={{
            maxWidth: "700px",
            backgroundColor: "#F7F7F7",
            padding: "24px",
            gap: "32px",
          }}
        >
          {/* Left side - Content */}
          <div className="flex-1 flex flex-col">
            <h1
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
                fontSize: "32px",
                color: "rgba(24, 24, 27, 1)",
                lineHeight: 1.2,
              }}
            >
              Start verifying at
              <br />
              $10/week
            </h1>
            <p
              className="mt-4"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                color: "rgba(24, 24, 27, 0.6)",
              }}
            >
              Complete payment to download the plugin
              <br />
              and start verifying up to 100 facts per week.
            </p>

            {isCanceled && (
              <p
                className="mt-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "#DC2626",
                }}
              >
                Payment was cancelled. Please try again.
              </p>
            )}

            <div className="mt-auto pt-8">
              <Button
                onClick={handleContinueToPayment}
                disabled={isLoading}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  backgroundColor: "rgba(24, 24, 27, 1)",
                  color: "white",
                  borderRadius: "50px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                {isLoading ? "Loading..." : "Complete Payment"}
              </Button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1">
            <img
              src="/onboarding/0.jpg"
              alt="Payment illustration"
              className="w-full h-full object-cover"
            />
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

export function DashboardLayout() {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  // Fetch subscription status (only if authenticated)
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: getCurrentSubscription,
    enabled: !!session,
  });

  // Derive subscription for use in sites query
  const subscription = subscriptionData?.subscription;
  const hasActiveSubscription = !!subscription && subscription.status === "active";

  // Fetch sites (only if authenticated and has active subscription)
  // This hook must be called unconditionally, but `enabled` controls when it actually runs
  const { data: sites, isLoading: isLoadingSites } = useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
    enabled: hasActiveSubscription,
  });

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show login UI if not authenticated
  if (!session) {
    const returnUrl = new URLSearchParams(location.search).get("return");
    return <LoginUI returnUrl={returnUrl} />;
  }

  // Show loading state while checking subscription
  if (isLoadingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show subscription UI if no active subscription
  if (!hasActiveSubscription) {
    return <SubscriptionUI user={session.user} />;
  }

  // Show loading state while checking sites
  if (isLoadingSites) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Check for OAuth return URL - if present, redirect to complete the OAuth flow
  // Check both URL params (direct access) and sessionStorage (after Google OAuth login)
  const returnUrlFromParams = new URLSearchParams(location.search).get("return");
  const returnUrlFromStorage = sessionStorage.getItem("oauth_return_url");
  const returnUrl = returnUrlFromParams || returnUrlFromStorage;

  if (returnUrl) {
    // Clear from sessionStorage to prevent redirect loops
    sessionStorage.removeItem("oauth_return_url");
    window.location.href = decodeURIComponent(returnUrl);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show onboarding if no sites connected
  if (sites && sites.length === 0) {
    return <OnboardingFlow user={session.user} />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex items-center border-b px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/FactPressLogo-black.svg" alt="" className="h-8" />
            <div className="flex flex-col" style={{ gap: "2px" }}>
              <span
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#18181B",
                  lineHeight: 1,
                }}
              >
                FactPress
              </span>
              <div className="flex items-center gap-1" style={{ opacity: 0.5 }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "#18181B",
                  }}
                >
                  powered by
                </span>
                <img src="/mira-logo-text.svg" alt="mira" style={{ height: "6px" }} />
              </div>
            </div>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 border-t p-4">
          <div className="mb-2 text-sm text-muted-foreground">
            {session?.user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-8">
          <Outlet />
        </div>
      </main>

      {/* Version indicator */}
      {import.meta.env.VITE_APP_VERSION && (
        <div className="fixed bottom-2 right-2 text-xs text-muted-foreground/50">
          v{import.meta.env.VITE_APP_VERSION}
        </div>
      )}
    </div>
  );
}

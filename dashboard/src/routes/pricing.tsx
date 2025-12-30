import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";

function MiraLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.947 3.28332L21.9761 0.884766L32.1155 15.958L28.4941 18.13V23.1536H27.7694L17.947 8.53343V3.28332Z" fill="currentColor"/>
      <path d="M9.393 7.7657L13.4221 5.36715L23.5615 20.4403L19.9401 22.6124V27.636H19.2153L9.393 13.0158V7.7657Z" fill="currentColor"/>
      <path d="M0.884277 12.2457L4.91335 9.84715L15.0528 24.9203L11.4314 27.0924V32.116H10.7066L0.884277 17.4958V12.2457Z" fill="currentColor"/>
    </svg>
  );
}

const plans = [
  {
    name: "Starter",
    price: 19,
    description: "For individual bloggers",
    features: [
      "100 verifications/month",
      "1 WordPress site",
      "Email support",
      "Basic verification badge",
    ],
  },
  {
    name: "Pro",
    price: 49,
    description: "For growing teams",
    popular: true,
    features: [
      "500 verifications/month",
      "5 WordPress sites",
      "Priority support",
      "Custom verification badge",
      "API access",
    ],
  },
  {
    name: "Business",
    price: 149,
    description: "For large organizations",
    features: [
      "2,000 verifications/month",
      "Unlimited WordPress sites",
      "Dedicated support",
      "Custom domain badge",
      "API access",
      "Team management",
    ],
  },
];

export function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <title>Pricing - Mira Verify</title>
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MiraLogo className="h-7 w-7" />
            <span className="text-lg font-semibold">Mira Verify</span>
          </Link>
          <nav className="flex items-center gap-4">
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

      {/* Pricing */}
      <main className="flex-1 py-24">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit mb-2">Most Popular</Badge>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link to={session?.user ? "/dashboard/billing" : "/register"}>
                      Get Started
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
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

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw } from "lucide-react";
import { getCurrentSubscription, getPlans, createCheckout, createPortalSession, syncSubscription } from "@/lib/api";

export function BillingPage() {
  const queryClient = useQueryClient();

  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: getCurrentSubscription,
  });

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const checkoutMutation = useMutation({
    mutationFn: createCheckout,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const portalMutation = useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  const subscription = subscriptionData?.subscription;
  const currentPlan = subscriptionData?.plan;

  // Auto-sync if user has stripeCustomerId but no active subscription
  useEffect(() => {
    if (
      !isLoadingSubscription &&
      subscription?.stripeCustomerId &&
      subscription?.status !== "active" &&
      !syncMutation.isPending &&
      !syncMutation.isSuccess
    ) {
      syncMutation.mutate();
    }
  }, [isLoadingSubscription, subscription, syncMutation]);

  const handleUpgrade = (priceId: string) => {
    checkoutMutation.mutate(priceId);
  };

  const handleManageBilling = () => {
    portalMutation.mutate();
  };

  const getPlanFeatures = (planName: string): string[] => {
    switch (planName) {
      case "Starter":
        return ["100 verifications/month", "1 WordPress site", "Email support"];
      case "Pro":
        return ["500 verifications/month", "5 WordPress sites", "Priority support", "API access"];
      case "Business":
        return ["2,000 verifications/month", "Unlimited sites", "Dedicated support", "API access"];
      default:
        return [];
    }
  };

  return (
    <div>
      <title>Billing - Mira Verify</title>
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your subscription and billing
      </p>

      {/* Current Plan */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            {subscription?.status === "active" ? "Your active subscription details" : "You don't have an active subscription"}
          </CardDescription>
        </CardHeader>
        {subscription?.status === "active" && currentPlan ? (
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                <p className="text-muted-foreground">
                  ${currentPlan.price / 100}/month
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Usage: {subscription.verificationsUsed} / {currentPlan.monthlyLimit} verifications
              </p>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  Renews: {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                </p>
              )}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-muted-foreground">
              Choose a plan below to get started with Mira Verify.
            </p>
          </CardContent>
        )}
        <CardFooter className="gap-2">
          <Button onClick={handleManageBilling} disabled={portalMutation.isPending}>
            {portalMutation.isPending ? "Loading..." : "Manage Subscription"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            title="Sync with Stripe"
          >
            <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
          </Button>
        </CardFooter>
      </Card>

      {/* Plans */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {subscription?.status === "active" ? "Upgrade Your Plan" : "Choose a Plan"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans?.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const features = getPlanFeatures(plan.name);

            return (
              <Card key={plan.id} className={isCurrentPlan ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {isCurrentPlan && <Badge>Current</Badge>}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${plan.price / 100}</span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || checkoutMutation.isPending}
                    onClick={() => handleUpgrade(plan.stripePriceId)}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : checkoutMutation.isPending
                        ? "Loading..."
                        : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

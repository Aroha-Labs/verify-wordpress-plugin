import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw, CreditCard } from "lucide-react";
import { getCurrentSubscription, createPortalSession, syncSubscription } from "@/lib/api";

export function BillingPage() {
  const queryClient = useQueryClient();

  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: getCurrentSubscription,
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

  const handleManageBilling = () => {
    portalMutation.mutate();
  };

  if (isLoadingSubscription) {
    return (
      <div>
        <title>Billing - FactPress</title>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <title>Billing - FactPress</title>
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your subscription and billing
      </p>

      {/* Current Subscription */}
      <Card className="mt-8 max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{currentPlan?.name || "FactPress Weekly"}</CardTitle>
              <CardDescription className="mt-1">
                <span className="text-3xl font-bold text-foreground">${(currentPlan?.price || 1000) / 100}</span>
                <span className="text-muted-foreground">/week</span>
              </CardDescription>
            </div>
            <Badge variant="default" className="text-sm">
              {subscription?.status === "active" ? "Active" : subscription?.status || "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Features */}
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              100 verifications/week
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              1 WordPress site
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Email support
            </li>
          </ul>

          {/* Usage & Renewal */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Verifications used</span>
              <span className="font-medium">
                {subscription?.verificationsUsed || 0} / {currentPlan?.monthlyLimit || 100}
              </span>
            </div>
            {subscription?.currentPeriodEnd && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Renews</span>
                <span className="font-medium">
                  {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={handleManageBilling} disabled={portalMutation.isPending}>
            <CreditCard className="h-4 w-4 mr-2" />
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

      {/* Help text */}
      <p className="mt-4 text-sm text-muted-foreground max-w-xl">
        Use "Manage Subscription" to update your payment method, view invoices, or cancel your subscription.
      </p>
    </div>
  );
}

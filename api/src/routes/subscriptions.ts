import { Hono } from "hono";
import { eq, and, gte, count } from "drizzle-orm";
import { createStripe } from "../lib/stripe";
import { subscriptions, plans, verificationHistory } from "../db/schema";
import { type AppEnv, requireUserId } from "../types";

const app = new Hono<AppEnv>();

// Auth middleware - require authenticated user
app.use("*", async (c, next) => {
  const auth = c.get("auth");
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", session.user.id);
  await next();
});

// Get all available plans
app.get("/plans", async (c) => {
  const db = c.get("db");
  const allPlans = await db.select().from(plans).all();
  return c.json(allPlans);
});

// Get current user's subscription
app.get("/current", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  if (!subscription) {
    return c.json({ subscription: null, plan: null });
  }

  // Get plan details
  const plan = subscription.planId
    ? await db.select().from(plans).where(eq(plans.id, subscription.planId)).get()
    : null;

  // Count actual verifications in current billing period
  const periodStart = subscription.currentPeriodStart || new Date(0);
  const verificationCount = await db
    .select({ count: count() })
    .from(verificationHistory)
    .where(
      and(
        eq(verificationHistory.userId, userId),
        gte(verificationHistory.createdAt, periodStart)
      )
    )
    .get();

  return c.json({
    subscription: {
      ...subscription,
      verificationsUsed: verificationCount?.count || 0,
    },
    plan,
  });
});

// Create checkout session
app.post("/checkout", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const stripe = createStripe(c.env.STRIPE_SECRET_KEY);
  const { priceId } = await c.req.json<{ priceId: string }>();

  // Get or create subscription record
  let subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  // Check if user already has an active subscription
  if (subscription?.status === "active") {
    return c.json({ error: "You already have an active subscription. Use the billing portal to manage it." }, 400);
  }

  let customerId = subscription?.stripeCustomerId;

  // Create Stripe customer if needed
  if (!customerId) {
    const auth = c.get("auth");
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    const customer = await stripe.customers.create({
      email: session!.user.email,
      metadata: { userId },
    });
    customerId = customer.id;

    // Create subscription record
    if (!subscription) {
      await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId,
        stripeCustomerId: customerId,
        status: "inactive",
      });
    } else {
      await db
        .update(subscriptions)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(subscriptions.userId, userId));
    }
  }

  // Create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${c.env.APP_URL}/dashboard`,
    cancel_url: `${c.env.APP_URL}/dashboard?canceled=true`,
    metadata: { userId },
  });

  return c.json({ url: checkoutSession.url });
});

// Sync subscription from Stripe
app.post("/sync", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const stripe = createStripe(c.env.STRIPE_SECRET_KEY);

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  if (!subscription?.stripeCustomerId) {
    return c.json({ synced: false, message: "No Stripe customer found" });
  }

  // Fetch active subscriptions from Stripe
  const stripeSubscriptions = await stripe.subscriptions.list({
    customer: subscription.stripeCustomerId,
    status: "active",
    limit: 1,
  });

  const activeSubscription = stripeSubscriptions.data[0];
  if (!activeSubscription) {
    // No active subscription in Stripe, mark as inactive locally
    await db
      .update(subscriptions)
      .set({ status: "inactive", updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId));
    return c.json({ synced: true, hasActiveSubscription: false });
  }

  // Find matching plan
  const priceId = activeSubscription.items.data[0]?.price.id;
  const plan = await db
    .select()
    .from(plans)
    .where(eq(plans.stripePriceId, priceId))
    .get();

  // Update local subscription
  await db
    .update(subscriptions)
    .set({
      stripeSubscriptionId: activeSubscription.id,
      planId: plan?.id,
      status: "active",
      currentPeriodStart: new Date(activeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(activeSubscription.current_period_end * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));

  return c.json({ synced: true, hasActiveSubscription: true });
});

// Create billing portal session
app.post("/portal", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const stripe = createStripe(c.env.STRIPE_SECRET_KEY);

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  if (!subscription?.stripeCustomerId) {
    return c.json({ error: "No subscription found" }, 400);
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${c.env.APP_URL}/dashboard/billing`,
  });

  return c.json({ url: portalSession.url });
});

export default app;

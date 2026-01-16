import { Hono } from "hono";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { createStripe } from "../lib/stripe";
import { subscriptions, plans } from "../db/schema";
import type { AppEnv } from "../types";

const app = new Hono<AppEnv>();

app.post("/stripe", async (c) => {
  const db = c.get("db");
  const stripe = createStripe(c.env.STRIPE_SECRET_KEY);

  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "Missing signature" }, 400);
  }

  const body = await c.req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        // Get subscription details from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = stripeSubscription.items.data[0]?.price.id;

        // Find the plan by stripe price id
        const plan = await db
          .select()
          .from(plans)
          .where(eq(plans.stripePriceId, priceId))
          .get();

        await db
          .update(subscriptions)
          .set({
            stripeSubscriptionId: subscriptionId,
            planId: plan?.id,
            status: "active",
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            verificationsUsed: 0,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      const subscriptionId = stripeSubscription.id;
      const priceId = stripeSubscription.items.data[0]?.price.id;

      // Map Stripe status to app status
      const statusMap: Record<string, string> = {
        active: "active",
        trialing: "active",
        past_due: "past_due",
        unpaid: "past_due",
        canceled: "canceled",
        incomplete: "inactive",
        incomplete_expired: "inactive",
        paused: "inactive",
      };
      const appStatus = statusMap[stripeSubscription.status];
      if (!appStatus) {
        throw new Error(`[Webhook] subscription.updated: unknown Stripe status "${stripeSubscription.status}"`);
      }

      // Find subscription by stripeSubscriptionId
      const existingSub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
        .get();

      if (!existingSub) {
        throw new Error(`[Webhook] subscription.updated: subscription not found for ${subscriptionId}`);
      }

      const plan = priceId ? await db
        .select()
        .from(plans)
        .where(eq(plans.stripePriceId, priceId))
        .get() : null;

      await db
        .update(subscriptions)
        .set({
          planId: plan?.id,
          status: appStatus,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existingSub.id));
      break;
    }

    case "customer.subscription.deleted": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      const subscriptionId = stripeSubscription.id;

      // Find subscription by stripeSubscriptionId
      const existingSub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
        .get();

      if (!existingSub) {
        throw new Error(`[Webhook] subscription.deleted: subscription not found for ${subscriptionId}`);
      }

      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, existingSub.id));
      break;
    }

    case "invoice.paid": {
      // Reset verifications used at the start of a new billing period
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Only reset if this is a subscription renewal (not the first invoice)
      if (invoice.billing_reason === "subscription_cycle") {
        await db
          .update(subscriptions)
          .set({
            verificationsUsed: 0,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeCustomerId, customerId));
      }
      break;
    }
  }

  return c.json({ received: true });
});

export default app;

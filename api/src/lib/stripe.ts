import Stripe from "stripe";

export function createStripe(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2024-10-28.acacia",
  });
}

export type StripeClient = ReturnType<typeof createStripe>;

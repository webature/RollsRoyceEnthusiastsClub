import "server-only";
import Stripe from "stripe";

function stripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY env var must be set.");
  }
  return key;
}

export const stripe = new Stripe(stripeSecretKey());

export const TIER_PRICE_IDS: Record<string, string> = {
  "e-single": process.env.STRIPE_PRICE_E_SINGLE ?? "",
  "e-joint": process.env.STRIPE_PRICE_E_JOINT ?? "",
  "paper-single": process.env.STRIPE_PRICE_PAPER_SINGLE ?? "",
  "paper-joint": process.env.STRIPE_PRICE_PAPER_JOINT ?? "",
};

export const JOINING_FEE_PRICE_ID = process.env.STRIPE_PRICE_JOINING_FEE ?? "";

export const TIER_LABELS: Record<string, string> = {
  "e-single": "E-Membership — Single",
  "e-joint": "E-Membership — Joint",
  "paper-single": "Paper Membership — Single",
  "paper-joint": "Paper Membership — Joint",
};

export function isValidTier(tier: string): boolean {
  return tier in TIER_PRICE_IDS;
}

/** subscription.current_period_end lives per-item, not on the subscription itself. */
export function subscriptionPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const item = subscription.items.data[0];
  if (!item) return null;
  return new Date(item.current_period_end * 1000);
}

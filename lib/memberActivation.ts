import "server-only";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { subscriptionPeriodEnd } from "@/lib/stripe";

function mapSubscriptionStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
    case "incomplete":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
    case "paused":
      return "canceled";
    default:
      return "past_due";
  }
}

/**
 * Idempotent: safe to call more than once with the same inputs (e.g. once from the
 * webhook, once from the /membership/welcome success-page bridge) — re-applying the
 * same status/Stripe-IDs write is a harmless no-op re-write, not a duplicate side effect.
 */
export async function activateMemberFromSubscription(
  memberId: string,
  customerId: string,
  subscription: Stripe.Subscription
) {
  await prisma.member.update({
    where: { id: memberId },
    data: {
      status: mapSubscriptionStatus(subscription.status),
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: subscriptionPeriodEnd(subscription),
    },
  });
}

/** For customer.subscription.updated/deleted — looked up by subscription id, not memberId. */
export async function syncMemberFromSubscription(subscription: Stripe.Subscription) {
  const member = await prisma.member.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!member) return;

  await prisma.member.update({
    where: { id: member.id },
    data: {
      status: mapSubscriptionStatus(subscription.status),
      currentPeriodEnd: subscriptionPeriodEnd(subscription),
    },
  });
}

/** For invoice.payment_failed — never resurrects an already-canceled member into past_due. */
export async function markMemberPastDueBySubscriptionId(subscriptionId: string) {
  const member = await prisma.member.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!member || member.status === "canceled") return;

  await prisma.member.update({
    where: { id: member.id },
    data: { status: "past_due" },
  });
}

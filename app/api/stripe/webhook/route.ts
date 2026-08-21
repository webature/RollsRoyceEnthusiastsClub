import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  activateMemberFromSubscription,
  syncMemberFromSubscription,
  markMemberPastDueBySubscriptionId,
} from "@/lib/memberActivation";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const memberId = session.metadata?.memberId;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      if (memberId && typeof customerId === "string" && typeof subscriptionId === "string") {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await activateMemberFromSubscription(memberId, customerId, subscription);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await syncMemberFromSubscription(subscription);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const subscriptionRef = invoice.parent?.subscription_details?.subscription;
      const subscriptionId =
        typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id;
      if (subscriptionId) {
        await markMemberPastDueBySubscriptionId(subscriptionId);
      }
      break;
    }

    default:
      break;
  }

  return new Response("ok", { status: 200 });
}

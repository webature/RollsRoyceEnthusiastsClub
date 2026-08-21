"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { getMemberSession } from "@/lib/memberAuth";
import { stripe, TIER_PRICE_IDS, JOINING_FEE_PRICE_ID, isValidTier } from "@/lib/stripe";

export type JoinFormState = { error?: string } | undefined;

async function currentOrigin() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function joinAction(
  _prevState: JoinFormState,
  formData: FormData
): Promise<JoinFormState> {
  const email = str(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const secondaryName = str(formData, "secondaryName");
  const phone = str(formData, "phone");
  const addressLine1 = str(formData, "addressLine1");
  const addressLine2 = str(formData, "addressLine2");
  const city = str(formData, "city");
  const postcode = str(formData, "postcode");
  const country = str(formData, "country");
  const tier = str(formData, "tier");

  if (!email || !password || !firstName || !lastName) {
    return { error: "Fill in your name, email and password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!isValidTier(tier)) {
    return { error: "Choose a membership tier." };
  }

  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing && existing.status !== "pending") {
    redirect("/portal/login");
  }

  const passwordHash = await hashPassword(password);
  const memberData = {
    passwordHash,
    firstName,
    lastName,
    secondaryName: secondaryName || null,
    phone: phone || null,
    addressLine1: addressLine1 || null,
    addressLine2: addressLine2 || null,
    city: city || null,
    postcode: postcode || null,
    country: country || null,
    tier,
  };

  const member = await prisma.member.upsert({
    where: { email },
    update: memberData,
    create: { email, status: "pending", ...memberData },
  });

  const origin = await currentOrigin();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: member.email,
    line_items: [
      { price: TIER_PRICE_IDS[tier], quantity: 1 },
      { price: JOINING_FEE_PRICE_ID, quantity: 1 },
    ],
    metadata: { memberId: member.id },
    success_url: `${origin}/membership/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/membership/join?tier=${tier}`,
  });

  if (!checkoutSession.url) {
    return { error: "Could not start checkout. Please try again." };
  }

  redirect(checkoutSession.url);
}

/**
 * Cookie writes are only allowed in a Server Action or Route Handler, never during a
 * page render — so /membership/welcome (a Server Component) verifies payment and does
 * the DB activation write, then this action (triggered by a button on that page) is
 * what actually establishes the session. The memberId comes from a hidden field the
 * server rendered after verifying the Stripe Checkout Session server-side, not from
 * arbitrary client input.
 */
export async function completeMemberLoginAction(formData: FormData) {
  const memberId = String(formData.get("memberId") ?? "");
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) redirect("/portal/login");

  const session = await getMemberSession();
  session.memberId = member.id;
  session.email = member.email;
  await session.save();

  redirect("/portal");
}

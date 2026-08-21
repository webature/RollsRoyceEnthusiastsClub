"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getCurrentMember } from "@/lib/memberAuth";
import { stripe } from "@/lib/stripe";

export async function openBillingPortalAction() {
  const currentMember = await getCurrentMember();
  if (!currentMember) redirect("/portal/login");

  const member = await prisma.member.findUnique({ where: { id: currentMember.id } });
  if (!member?.stripeCustomerId) redirect("/portal");

  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  const origin = `${proto}://${host}`;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: member.stripeCustomerId,
    return_url: `${origin}/portal`,
  });

  redirect(portalSession.url);
}

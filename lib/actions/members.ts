"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Manually grant/restore an active membership — e.g. a comped or offline-paid member. */
export async function compMemberAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.member.update({ where: { id }, data: { status: "active" } });
  redirect(`/admin/members/${id}`);
}

/** Cancels the Stripe subscription (if any) and marks the member canceled. */
export async function cancelMemberAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const member = await prisma.member.findUnique({ where: { id } });
  if (member?.stripeSubscriptionId) {
    await stripe.subscriptions.cancel(member.stripeSubscriptionId).catch(() => {});
  }
  await prisma.member.update({ where: { id }, data: { status: "canceled" } });
  redirect(`/admin/members/${id}`);
}

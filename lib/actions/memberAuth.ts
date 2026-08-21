"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getMemberSession, verifyPassword } from "@/lib/memberAuth";

export type MemberLoginState = { error?: string } | undefined;

export async function memberLoginAction(
  _prevState: MemberLoginState,
  formData: FormData
): Promise<MemberLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const member = await prisma.member.findUnique({ where: { email } });
  if (!member || !(await verifyPassword(password, member.passwordHash))) {
    return { error: "Incorrect email or password." };
  }

  const session = await getMemberSession();
  session.memberId = member.id;
  session.email = member.email;
  await session.save();

  redirect("/portal");
}

export async function memberLogoutAction() {
  const session = await getMemberSession();
  session.destroy();
  await session.save();
  redirect("/portal/login");
}

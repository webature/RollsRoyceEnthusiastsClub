"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession, verifyPassword } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect email or password." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  await session.save();
  redirect("/admin/login");
}

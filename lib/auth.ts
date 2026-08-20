import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export { hashPassword, verifyPassword } from "@/lib/password";

export const SESSION_COOKIE_NAME = "rrec_admin_session";

export type SessionData = {
  userId?: string;
  email?: string;
};

function sessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set to a random string of at least 32 characters."
    );
  }
  return secret;
}

export const sessionOptions: SessionOptions = {
  get password() {
    return sessionPassword();
  },
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session.userId) return null;
  return { id: session.userId, email: session.email ?? "" };
}

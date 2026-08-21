import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export { hashPassword, verifyPassword } from "@/lib/password";

export const MEMBER_SESSION_COOKIE_NAME = "rrec_member_session";

export type MemberSessionData = {
  memberId?: string;
  email?: string;
};

function memberSessionPassword(): string {
  const secret = process.env.MEMBER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "MEMBER_SESSION_SECRET env var must be set to a random string of at least 32 characters."
    );
  }
  return secret;
}

export const memberSessionOptions: SessionOptions = {
  get password() {
    return memberSessionPassword();
  },
  cookieName: MEMBER_SESSION_COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getMemberSession() {
  const cookieStore = await cookies();
  return getIronSession<MemberSessionData>(cookieStore, memberSessionOptions);
}

export async function getCurrentMember() {
  const session = await getMemberSession();
  if (!session.memberId) return null;
  return { id: session.memberId, email: session.email ?? "" };
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsealData } from "iron-session";
import { SESSION_COOKIE_NAME, sessionOptions, type SessionData } from "@/lib/auth";
import {
  MEMBER_SESSION_COOKIE_NAME,
  memberSessionOptions,
  type MemberSessionData,
} from "@/lib/memberAuth";

async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return false;
  try {
    const data = await unsealData<SessionData>(cookie, {
      password: sessionOptions.password as string,
    });
    return Boolean(data.userId);
  } catch {
    return false;
  }
}

async function isMemberAuthenticated(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(MEMBER_SESSION_COOKIE_NAME)?.value;
  if (!cookie) return false;
  try {
    const data = await unsealData<MemberSessionData>(cookie, {
      password: memberSessionOptions.password as string,
    });
    return Boolean(data.memberId);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const authenticated = await isAdminAuthenticated(request);

    if (!authenticated && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (authenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal")) {
    const isLoginPage = pathname === "/portal/login";
    const authenticated = await isMemberAuthenticated(request);

    if (!authenticated && !isLoginPage) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
    if (authenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

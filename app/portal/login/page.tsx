"use client";

import { useActionState } from "react";
import Link from "next/link";
import { memberLoginAction, type MemberLoginState } from "@/lib/actions/memberAuth";
import styles from "./page.module.css";

export default function MemberLoginPage() {
  const [state, formAction, pending] = useActionState<MemberLoginState, FormData>(
    memberLoginAction,
    undefined
  );

  return (
    <div className={styles.wrap}>
      <form className={styles.card} action={formAction}>
        <div className={styles.logo}>RREC Membership</div>
        <p className={styles.subtitle}>Sign in to your membership account.</p>

        {state?.error ? <p className={styles.error}>{state.error}</p> : null}

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className={`btn btnOutline ${styles.submit}`} disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>

        <p className={styles.footer}>
          Not a member yet? <Link href="/membership">See membership options →</Link>
        </p>
      </form>
    </div>
  );
}

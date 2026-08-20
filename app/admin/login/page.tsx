"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );

  return (
    <div className={styles.wrap}>
      <form className={styles.card} action={formAction}>
        <div className={styles.logo}>RREC Admin</div>
        <p className={styles.subtitle}>Sign in to manage news and events.</p>

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
      </form>
    </div>
  );
}

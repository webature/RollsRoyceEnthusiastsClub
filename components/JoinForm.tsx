"use client";

import { useActionState } from "react";
import { joinAction, type JoinFormState } from "@/lib/actions/memberJoin";
import styles from "@/app/(site)/membership/join/page.module.css";

const TIERS = [
  { value: "e-single", label: "E-Membership — Single (£69/yr)" },
  { value: "e-joint", label: "E-Membership — Joint (£79/yr)" },
  { value: "paper-single", label: "Paper Membership — Single (£95/yr)" },
  { value: "paper-joint", label: "Paper Membership — Joint (£110/yr)" },
];

export default function JoinForm({ initialTier }: { initialTier?: string }) {
  const [state, formAction, pending] = useActionState<JoinFormState, FormData>(
    joinAction,
    undefined
  );

  return (
    <form className={styles.form} action={formAction}>
      {state?.error ? <p className={styles.error}>{state.error}</p> : null}

      <div className={styles.field}>
        <label htmlFor="tier">Membership tier</label>
        <select id="tier" name="tier" defaultValue={initialTier ?? "e-single"} required>
          {TIERS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <span className={styles.hint}>Plus a one-time £35 joining fee in your first year.</span>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" autoComplete="given-name" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" autoComplete="family-name" required />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="secondaryName">Second member's name (for Joint tiers)</label>
        <input id="secondaryName" name="secondaryName" autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <span className={styles.hint}>At least 8 characters — this signs you into your membership account.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <div className={styles.field}>
        <label htmlFor="addressLine1">Address line 1 (optional)</label>
        <input id="addressLine1" name="addressLine1" autoComplete="address-line1" />
      </div>
      <div className={styles.field}>
        <label htmlFor="addressLine2">Address line 2 (optional)</label>
        <input id="addressLine2" name="addressLine2" autoComplete="address-line2" />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="city">Town / city (optional)</label>
          <input id="city" name="city" autoComplete="address-level2" />
        </div>
        <div className={styles.field}>
          <label htmlFor="postcode">Postcode (optional)</label>
          <input id="postcode" name="postcode" autoComplete="postal-code" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Country (optional)</label>
        <input id="country" name="country" autoComplete="country-name" defaultValue="United Kingdom" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btnDark" disabled={pending}>
          {pending ? "Redirecting to payment…" : "Continue to payment →"}
        </button>
      </div>
    </form>
  );
}

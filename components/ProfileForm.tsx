"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/lib/actions/memberProfile";
import styles from "@/app/portal/(protected)/portal.module.css";

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  secondaryName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
};

export default function ProfileForm({ initialValues }: { initialValues: ProfileFormValues }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    undefined
  );

  return (
    <form className={styles.form} action={formAction}>
      {state?.error ? <p className={styles.error}>{state.error}</p> : null}
      {state?.success ? <p className={styles.success}>Saved.</p> : null}

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" defaultValue={initialValues.firstName} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" defaultValue={initialValues.lastName} required />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="secondaryName">Second member&rsquo;s name (Joint tiers)</label>
        <input id="secondaryName" name="secondaryName" defaultValue={initialValues.secondaryName} />
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" defaultValue={initialValues.phone} />
      </div>

      <div className={styles.field}>
        <label htmlFor="addressLine1">Address line 1</label>
        <input id="addressLine1" name="addressLine1" defaultValue={initialValues.addressLine1} />
      </div>
      <div className={styles.field}>
        <label htmlFor="addressLine2">Address line 2</label>
        <input id="addressLine2" name="addressLine2" defaultValue={initialValues.addressLine2} />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="city">Town / city</label>
          <input id="city" name="city" defaultValue={initialValues.city} />
        </div>
        <div className={styles.field}>
          <label htmlFor="postcode">Postcode</label>
          <input id="postcode" name="postcode" defaultValue={initialValues.postcode} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Country</label>
        <input id="country" name="country" defaultValue={initialValues.country} />
      </div>

      <div>
        <button type="submit" className="btn btnDark" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

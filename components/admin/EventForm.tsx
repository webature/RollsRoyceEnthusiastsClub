"use client";

import { useActionState } from "react";
import type { EventFormState } from "@/lib/actions/events";
import styles from "@/app/admin/(protected)/admin.module.css";

export type EventFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: string;
};

export default function EventForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
  initialValues?: EventFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    action,
    undefined
  );

  return (
    <form className={styles.form} action={formAction}>
      {state?.error ? <p className={styles.error}>{state.error}</p> : null}

      <div className={styles.field}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" defaultValue={initialValues?.title} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="slug">URL slug</label>
        <input id="slug" name="slug" defaultValue={initialValues?.slug} placeholder="auto-generated from title if left blank" />
        <span className={styles.hint}>Appears at /events/&lt;slug&gt;. Leave blank to generate from the title.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="excerpt">Excerpt</label>
        <input
          id="excerpt"
          name="excerpt"
          defaultValue={initialValues?.excerpt}
          placeholder="One or two sentences shown in the events list"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="body">Body</label>
        <textarea id="body" name="body" defaultValue={initialValues?.body} required />
        <span className={styles.hint}>Separate paragraphs with a blank line.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="location">Location (optional)</label>
        <input id="location" name="location" defaultValue={initialValues?.location} placeholder="Venue, postcode" />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="startsAt">Starts</label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={initialValues?.startsAt}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="endsAt">Ends (optional)</label>
          <input id="endsAt" name="endsAt" type="datetime-local" defaultValue={initialValues?.endsAt} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="coverImage">Cover image URL (optional)</label>
        <input id="coverImage" name="coverImage" defaultValue={initialValues?.coverImage} placeholder="https://…" />
        <span className={styles.hint}>Leave blank to use the placeholder pattern.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={initialValues?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btnDark" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

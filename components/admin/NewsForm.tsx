"use client";

import { useActionState } from "react";
import type { PostFormState } from "@/lib/actions/news";
import ImageUploadField from "./ImageUploadField";
import styles from "@/app/admin/(protected)/admin.module.css";

export type NewsFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  status: string;
};

export default function NewsForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  initialValues?: NewsFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
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
        <span className={styles.hint}>Appears at /news/&lt;slug&gt;. Leave blank to generate from the title.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="excerpt">Excerpt</label>
        <input
          id="excerpt"
          name="excerpt"
          defaultValue={initialValues?.excerpt}
          placeholder="One or two sentences shown in the news list"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="body">Body</label>
        <textarea id="body" name="body" defaultValue={initialValues?.body} required />
        <span className={styles.hint}>Separate paragraphs with a blank line.</span>
      </div>

      <div className={styles.field}>
        <ImageUploadField
          name="coverImage"
          label="Cover image (optional)"
          initialUrl={initialValues?.coverImage}
        />
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

"use client";

import { useId, useRef, useState } from "react";
import { uploadImage } from "@/lib/actions/upload";
import styles from "./ImageUploadField.module.css";

export default function ImageUploadField({
  name,
  label,
  initialUrl,
}: {
  name: string;
  label: string;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);

    setUploading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setUrl(result.url);
  }

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <div className={styles.wrap}>
        <div className={styles.preview}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/remote URL, not a static site asset
            <img src={url} alt="" />
          ) : (
            <span className={styles.previewEmpty}>No image</span>
          )}
        </div>
        <div className={styles.controls}>
          <label className={styles.fileLabel} htmlFor={inputId}>
            {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
          </label>
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className={styles.fileInput}
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {url ? (
            <button
              type="button"
              className={styles.remove}
              onClick={() => {
                setUrl("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove image
            </button>
          ) : (
            <span className={styles.status}>JPEG, PNG, WebP or GIF, up to 5MB.</span>
          )}
          {error ? <span className={styles.error}>{error}</span> : null}
        </div>
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}

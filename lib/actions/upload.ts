"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getCurrentAdmin } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type UploadResult = { url: string } | { error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Not signed in." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Use a JPEG, PNG, WebP or GIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be smaller than 5MB." };
  }

  const ext = file.type.split("/")[1];
  const filename = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: "public" });
    return { url: blob.url };
  }

  // Local dev fallback: write to public/uploads so it's servable without any
  // extra setup. Not suitable for production (Vercel's filesystem is
  // ephemeral) — connect Vercel Blob storage there instead (see CLAUDE.md).
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);
  return { url: `/uploads/${filename}` };
}

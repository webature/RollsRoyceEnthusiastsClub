"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type PostFormState = { error?: string } | undefined;

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";
  const slugInput = String(formData.get("slug") ?? "").trim();

  return {
    title,
    excerpt,
    body,
    coverImage: coverImage || null,
    status,
    slug: slugify(slugInput || title),
  };
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const admin = await requireAdmin();
  const data = readForm(formData);

  if (!data.title || !data.excerpt || !data.body || !data.slug) {
    return { error: "Title, excerpt, body and slug are required." };
  }

  await prisma.post.create({
    data: {
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: admin.id,
    },
  });

  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  await requireAdmin();
  const data = readForm(formData);

  if (!data.title || !data.excerpt || !data.body || !data.slug) {
    return { error: "Title, excerpt, body and slug are required." };
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { error: "Post not found." };

  const wasPublished = existing.status === "published";
  const nowPublished = data.status === "published";

  await prisma.post.update({
    where: { id },
    data: {
      ...data,
      publishedAt: nowPublished
        ? (existing.publishedAt ?? new Date())
        : wasPublished
          ? existing.publishedAt
          : null,
    },
  });

  revalidatePath("/news");
  revalidatePath(`/news/${existing.slug}`);
  revalidatePath(`/news/${data.slug}`);
  revalidatePath("/");
  redirect("/admin/news");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const post = await prisma.post.delete({ where: { id } }).catch(() => null);
  revalidatePath("/news");
  if (post) revalidatePath(`/news/${post.slug}`);
  revalidatePath("/");
  redirect("/admin/news");
}

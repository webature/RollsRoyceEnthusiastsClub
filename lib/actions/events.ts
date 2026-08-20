"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type EventFormState = { error?: string } | undefined;

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

function parseDate(value: FormDataEntryValue | null): Date | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const status = formData.get("status") === "published" ? "published" : "draft";
  const slugInput = String(formData.get("slug") ?? "").trim();
  const startsAt = parseDate(formData.get("startsAt"));
  const endsAt = parseDate(formData.get("endsAt"));

  return {
    title,
    excerpt,
    body,
    coverImage: coverImage || null,
    location: location || null,
    status,
    slug: slugify(slugInput || title),
    startsAt,
    endsAt,
  };
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const admin = await requireAdmin();
  const data = readForm(formData);

  if (!data.title || !data.excerpt || !data.body || !data.slug || !data.startsAt) {
    return { error: "Title, excerpt, body, slug and start date are required." };
  }

  await prisma.event.create({
    data: {
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      coverImage: data.coverImage,
      location: data.location,
      status: data.status,
      slug: data.slug,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: admin.id,
    },
  });

  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();
  const data = readForm(formData);

  if (!data.title || !data.excerpt || !data.body || !data.slug || !data.startsAt) {
    return { error: "Title, excerpt, body, slug and start date are required." };
  }

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return { error: "Event not found." };

  const wasPublished = existing.status === "published";
  const nowPublished = data.status === "published";

  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      coverImage: data.coverImage,
      location: data.location,
      status: data.status,
      slug: data.slug,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      publishedAt: nowPublished
        ? (existing.publishedAt ?? new Date())
        : wasPublished
          ? existing.publishedAt
          : null,
    },
  });

  revalidatePath("/events");
  revalidatePath(`/events/${existing.slug}`);
  revalidatePath(`/events/${data.slug}`);
  revalidatePath("/");
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const event = await prisma.event.delete({ where: { id } }).catch(() => null);
  revalidatePath("/events");
  if (event) revalidatePath(`/events/${event.slug}`);
  revalidatePath("/");
  redirect("/admin/events");
}

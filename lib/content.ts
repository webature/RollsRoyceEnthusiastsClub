import { prisma } from "@/lib/db";

export function getPublishedPosts(limit?: number) {
  return prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export function getPostBySlug(slug: string) {
  return prisma.post.findFirst({ where: { slug, status: "published" } });
}

export async function getUpcomingAndPastEvents() {
  const events = await prisma.event.findMany({
    where: { status: "published" },
    orderBy: { startsAt: "asc" },
  });
  const now = new Date();
  return {
    upcoming: events.filter((e) => e.startsAt >= now),
    past: events.filter((e) => e.startsAt < now).reverse(),
  };
}

export function getEventBySlug(slug: string) {
  return prisma.event.findFirst({ where: { slug, status: "published" } });
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

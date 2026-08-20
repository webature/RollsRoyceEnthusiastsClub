import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Photo from "@/components/ui/Photo";
import { getEventBySlug, formatDate } from "@/lib/content";
import { paragraphs } from "@/lib/format";
import styles from "../../news/[slug]/page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title, description: event.excerpt };
}

export default async function EventDetailPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const dateLabel = event.endsAt
    ? `${formatDate(event.startsAt)} – ${formatDate(event.endsAt)}`
    : formatDate(event.startsAt);

  return (
    <>
      <section className={styles.hero}>
        <p className={`eyebrow ${styles.date}`}>
          {dateLabel}
          {event.location ? ` · ${event.location}` : ""}
        </p>
        <h1>{event.title}</h1>
      </section>
      {event.coverImage ? (
        <Photo src={event.coverImage} alt={event.title} className={styles.image} sizes="100vw" />
      ) : (
        <PlaceholderImage className={styles.image} caption={event.title} />
      )}
      <div className={styles.body}>
        {paragraphs(event.body).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <Link className={`textLink ${styles.back}`} href="/events">
          ← All events
        </Link>
      </div>
    </>
  );
}

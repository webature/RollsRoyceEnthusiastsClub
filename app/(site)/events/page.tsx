import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PostList from "@/components/ui/PostList";
import CardsGrid from "@/components/ui/CardsGrid";
import { getUpcomingAndPastEvents, formatDate } from "@/lib/content";
import styles from "@/components/ui/PostList.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Remarkable cars. Memorable places. Good company. The RREC events calendar.",
};

function dateLabel(event: { startsAt: Date; endsAt: Date | null }) {
  const start = formatDate(event.startsAt);
  if (!event.endsAt) return start;
  return `${start} – ${formatDate(event.endsAt)}`;
}

export default async function EventsPage() {
  const { upcoming, past } = await getUpcomingAndPastEvents();

  return (
    <>
      <PageHero
        eyebrow="The RREC Calendar"
        title="Events"
        intro="Remarkable cars. Memorable places. Good company."
        image="/images/car-silver-london.jpg"
      />

      <CardsGrid
        items={[
          {
            eyebrow: "Learn",
            title: "Technical Seminars",
            body: "Specialist-led sessions covering everything from the 20hp through to the Silver Spirit and derivatives — over 5,000 members have taken part.",
            image: "/images/workshop-bw.jpg",
          },
          {
            eyebrow: "Local",
            title: "Section Events",
            body: "Days out, regular pub meets and weekend rallies organised by Sections such as the German Section.",
            href: "/sections",
            image: "/images/world-map.jpg",
          },
          {
            eyebrow: "Model-specific",
            title: "Register Events",
            body: "Driving tours and gatherings run by Model Registers, from the Post-war Sixes register and beyond.",
            href: "/registers",
            image: "/images/car-silver-shadow.jpg",
          },
        ]}
      />

      <section className={styles.list}>
        <h2 className={styles.sectionHeading}>Upcoming</h2>
        <PostList
          emptyLabel="No upcoming events published yet — check back soon."
          items={upcoming.map((event) => ({
            slug: event.slug,
            title: event.title,
            excerpt: event.excerpt,
            dateLabel: dateLabel(event),
            meta: event.location ?? undefined,
            href: `/events/${event.slug}`,
            image: event.coverImage,
          }))}
        />

        <h2 className={styles.sectionHeading}>Past</h2>
        <PostList
          emptyLabel="No past events yet."
          items={past.map((event) => ({
            slug: event.slug,
            title: event.title,
            excerpt: event.excerpt,
            dateLabel: dateLabel(event),
            meta: event.location ?? undefined,
            href: `/events/${event.slug}`,
            image: event.coverImage,
          }))}
        />
      </section>
    </>
  );
}

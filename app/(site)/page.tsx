import Link from "next/link";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import Editorial from "@/components/ui/Editorial";
import CardsGrid from "@/components/ui/CardsGrid";
import PostList from "@/components/ui/PostList";
import { getPublishedPosts, formatDate } from "@/lib/content";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestPosts = await getPublishedPosts(3);

  return (
    <>
      <section className={styles.hero}>
        <BackgroundVideo className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroCopy}>
          <p className="eyebrow">The Rolls-Royce Enthusiasts&rsquo; Club</p>
          <h1>
            A shared passion.
            <br />
            <em>An enduring legacy.</em>
          </h1>
          <p>
            The international club for Rolls-Royce and Bentley enthusiasts —
            owners and non-owners alike.
          </p>
          <div className={styles.actions}>
            <Link className="btn btnLight" href="/about">
              Discover the club
            </Link>
            <Link className="textLink" href="/membership">
              Become a member →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.split}>
        <div>
          <p className="eyebrow">Established 1957</p>
          <h2>
            More than
            <br />a motor club.
          </h2>
        </div>
        <div>
          <p className={styles.lead}>
            A worldwide community united by extraordinary motor cars,
            engineering excellence, heritage and friendship.
          </p>
          <p>
            From local Sections and international rallies to Model Registers,
            archives and award-winning publications, the RREC brings
            enthusiasts closer to the marques and to one another — enthusiasm
            comes first, ownership is not required.
          </p>
          <Link className="textLink" href="/history">
            Our story →
          </Link>
        </div>
      </section>

      <CardsGrid
        items={[
          {
            eyebrow: "01",
            title: "Events",
            body: "National rallies, Section gatherings and technical seminars throughout the year.",
            href: "/events",
            image: "/images/car-bentley.jpg",
          },
          {
            eyebrow: "02",
            title: "Worldwide Sections",
            body: "Find your local community of enthusiasts, wherever you are.",
            href: "/sections",
            image: "/images/world-map.jpg",
          },
          {
            eyebrow: "03",
            title: "Model Registers",
            body: "Specialist knowledge and technical support for individual models.",
            href: "/registers",
            image: "/images/car-silver-shadow.jpg",
          },
        ]}
      />

      <section className={styles.darkPanel}>
        <p className="eyebrow">Membership</p>
        <h2>
          Belong to something
          <br />
          <em>remarkable.</em>
        </h2>
        <p>
          Join an international community with access to events, publications,
          technical seminars, archives and specialist resources — for anyone
          with a genuine interest in Rolls-Royce and Bentley motor cars.
        </p>
        <Link className="btn btnOutline" href="/membership">
          Explore membership
        </Link>
      </section>

      <Editorial eyebrow="Heritage" title={<>Preserving the past.<br />Inspiring the future.</>} cta={
        <Link className="textLink" href="/foundation">Explore our heritage →</Link>
      } image="/images/car-silver-london.jpg" imageAlt="A vintage Rolls-Royce parked on a London street">
        <p>
          Discover the people, engineering, archives and stories behind
          Rolls-Royce and Bentley — safeguarded by the Sir Henry Royce
          Memorial Foundation since 1977.
        </p>
      </Editorial>

      {latestPosts.length > 0 ? (
        <section className={styles.newsStrip}>
          <div className={styles.newsHead}>
            <h2>Latest news</h2>
            <Link className="textLink" href="/news">
              All news →
            </Link>
          </div>
          <PostList
            emptyLabel=""
            items={latestPosts.map((post) => ({
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              dateLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
              href: `/news/${post.slug}`,
              image: post.coverImage,
            }))}
          />
        </section>
      ) : null}
    </>
  );
}

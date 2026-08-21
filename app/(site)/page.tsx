import Link from "next/link";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import Editorial from "@/components/ui/Editorial";
import CardsGrid from "@/components/ui/CardsGrid";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { getPublishedPosts, formatDate } from "@/lib/content";
import styles from "./page.module.css";

const STATS = [
  { number: "1957", label: "Founded" },
  { number: "36", label: "Sections worldwide" },
  { number: "2", label: "Marques celebrated" },
  { number: "1000s", label: "Enthusiasts, worldwide" },
];

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
        <div className={styles.scrollCue} aria-hidden="true">
          <span>Scroll</span>
        </div>
      </section>

      <div className={styles.statsStrip}>
        <Reveal className={styles.statsGrid}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </div>

      <section className={styles.split}>
        <Reveal>
          <p className="eyebrow">Established 1957</p>
          <h2>
            More than
            <br />a motor club.
          </h2>
        </Reveal>
        <Reveal delay={120}>
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
        </Reveal>
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
        <Photo
          src="/images/workshop-bw.jpg"
          alt=""
          className={styles.darkPanelBg}
          sizes="100vw"
        />
        <div className={styles.darkPanelOverlay} />
        <span className={styles.darkPanelMark} aria-hidden="true">
          ”
        </span>
        <Reveal className={styles.darkPanelContent}>
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
        </Reveal>
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
          <Reveal className={styles.newsHead}>
            <h2>Latest news</h2>
            <Link className="textLink" href="/news">
              All news →
            </Link>
          </Reveal>
          <div className={styles.newsGrid}>
            <Reveal className={styles.newsFeatured}>
              <Link href={`/news/${latestPosts[0].slug}`}>
                <div className={styles.newsFeaturedImageWrap}>
                  {latestPosts[0].coverImage ? (
                    <Photo
                      src={latestPosts[0].coverImage}
                      alt={latestPosts[0].title}
                      className={styles.newsFeaturedImage}
                      sizes="(max-width: 850px) 100vw, 55vw"
                    />
                  ) : (
                    <PlaceholderImage className={styles.newsFeaturedImage} />
                  )}
                </div>
                <span className={styles.newsFeaturedDate}>
                  {latestPosts[0].publishedAt ? formatDate(latestPosts[0].publishedAt) : ""}
                </span>
                <h3>
                  {latestPosts[0].title}
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </h3>
                <p>{latestPosts[0].excerpt}</p>
              </Link>
            </Reveal>

            {latestPosts.length > 1 ? (
              <div className={styles.newsSide}>
                {latestPosts.slice(1).map((post, index) => (
                  <Reveal key={post.slug} delay={(index + 1) * 100}>
                    <Link href={`/news/${post.slug}`} className={styles.newsSideRow}>
                      <div className={styles.newsSideImageWrap}>
                        {post.coverImage ? (
                          <Photo
                            src={post.coverImage}
                            alt={post.title}
                            className={styles.newsSideImage}
                            sizes="140px"
                          />
                        ) : (
                          <PlaceholderImage className={styles.newsSideImage} />
                        )}
                      </div>
                      <div>
                        <span className={styles.newsSideDate}>
                          {post.publishedAt ? formatDate(post.publishedAt) : ""}
                        </span>
                        <h4>{post.title}</h4>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

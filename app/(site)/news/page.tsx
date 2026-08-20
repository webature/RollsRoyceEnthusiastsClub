import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PostList from "@/components/ui/PostList";
import { getPublishedPosts, formatDate } from "@/lib/content";
import styles from "@/components/ui/PostList.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news from the Rolls-Royce Enthusiasts' Club.",
};

export default async function NewsPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="The RREC Calendar"
        title="News"
        intro="Club news, announcements and stories from across the RREC."
        image="/images/car-silver-shadow.jpg"
      />
      <section className={styles.list}>
        <PostList
          emptyLabel="No news posts published yet — check back soon."
          items={posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            dateLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
            href: `/news/${post.slug}`,
            image: post.coverImage,
          }))}
        />
      </section>
    </>
  );
}

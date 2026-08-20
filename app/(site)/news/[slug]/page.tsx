import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Photo from "@/components/ui/Photo";
import { getPostBySlug, formatDate } from "@/lib/content";
import { paragraphs } from "@/lib/format";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function NewsDetailPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <section className={styles.hero}>
        <p className={`eyebrow ${styles.date}`}>
          {post.publishedAt ? formatDate(post.publishedAt) : ""}
        </p>
        <h1>{post.title}</h1>
      </section>
      {post.coverImage ? (
        <Photo src={post.coverImage} alt={post.title} className={styles.image} sizes="100vw" />
      ) : (
        <PlaceholderImage className={styles.image} caption={post.title} />
      )}
      <div className={styles.body}>
        {paragraphs(post.body).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <Link className={`textLink ${styles.back}`} href="/news">
          ← All news
        </Link>
      </div>
    </>
  );
}

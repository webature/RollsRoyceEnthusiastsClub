import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";
import Photo from "./Photo";
import Reveal from "./Reveal";
import styles from "./PostList.module.css";

export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  meta?: string;
  href: string;
  image?: string | null;
};

export default function PostList({
  items,
  emptyLabel,
}: {
  items: PostListItem[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyLabel}</p>;
  }

  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <Reveal key={item.slug} delay={Math.min(index, 4) * 70}>
          <Link href={item.href} className={styles.row}>
            <div className={styles.imageWrap}>
              {item.image ? (
                <Photo src={item.image} alt={item.title} className={styles.image} sizes="200px" />
              ) : (
                <PlaceholderImage className={styles.image} />
              )}
            </div>
            <div>
              <span className={styles.date}>{item.dateLabel}</span>
              {item.meta ? <div className={styles.meta}>{item.meta}</div> : null}
            </div>
            <div>
              <h3>
                {item.title}
                <span className={styles.arrow} aria-hidden="true">→</span>
              </h3>
              <p>{item.excerpt}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

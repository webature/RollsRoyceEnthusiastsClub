import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";
import Photo from "./Photo";
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
    <div>
      {items.map((item) => (
        <Link key={item.slug} href={item.href} className={styles.row}>
          {item.image ? (
            <Photo src={item.image} alt={item.title} className={styles.image} sizes="200px" />
          ) : (
            <PlaceholderImage className={styles.image} />
          )}
          <div>
            <span className={styles.date}>{item.dateLabel}</span>
            {item.meta ? <div className={styles.meta}>{item.meta}</div> : null}
          </div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

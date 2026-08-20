import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";
import Photo from "./Photo";
import styles from "./CardsGrid.module.css";

export default function CardsGrid({
  items,
}: {
  items: {
    eyebrow: string;
    title: string;
    body: string;
    href?: string;
    imageAngle?: number;
    image?: string;
  }[];
}) {
  return (
    <section className={styles.grid}>
      {items.map((item) => {
        const content = (
          <>
            {item.image ? (
              <Photo src={item.image} alt={item.title} className={styles.image} />
            ) : (
              <PlaceholderImage angle={item.imageAngle} className={styles.image} />
            )}
            <p className={`eyebrow ${styles.eyebrow}`}>{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </>
        );
        return (
          <article key={item.title} className={styles.card}>
            {item.href ? <Link href={item.href}>{content}</Link> : content}
          </article>
        );
      })}
    </section>
  );
}

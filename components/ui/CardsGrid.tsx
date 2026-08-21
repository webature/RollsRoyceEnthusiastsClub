import Link from "next/link";
import PlaceholderImage from "./PlaceholderImage";
import Photo from "./Photo";
import Reveal from "./Reveal";
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
      {items.map((item, index) => {
        const content = (
          <>
            <div className={styles.imageWrap}>
              {item.image ? (
                <Photo src={item.image} alt={item.title} className={styles.image} />
              ) : (
                <PlaceholderImage angle={item.imageAngle} className={styles.image} />
              )}
            </div>
            <p className={`eyebrow ${styles.eyebrow}`}>{item.eyebrow}</p>
            <h3>
              {item.title}
              {item.href ? <span className={styles.arrow} aria-hidden="true">→</span> : null}
            </h3>
            <p>{item.body}</p>
          </>
        );
        return (
          <Reveal key={item.title} delay={index * 100}>
            <article className={styles.card}>
              {item.href ? <Link href={item.href}>{content}</Link> : content}
            </article>
          </Reveal>
        );
      })}
    </section>
  );
}

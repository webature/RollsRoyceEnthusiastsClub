import type { ReactNode } from "react";
import Photo from "./Photo";
import styles from "./PageHero.module.css";

export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
}) {
  return (
    <section className={styles.hero}>
      {image ? <Photo src={image} alt="" className={styles.bg} sizes="100vw" /> : null}
      {image ? <div className={styles.overlay} /> : null}
      <div className={styles.content}>
        <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
        <h1>{title}</h1>
        {intro ? <p className={styles.intro}>{intro}</p> : null}
      </div>
    </section>
  );
}

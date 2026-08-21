import type { ReactNode } from "react";
import PlaceholderImage from "./PlaceholderImage";
import Photo from "./Photo";
import Reveal from "./Reveal";
import styles from "./Editorial.module.css";

export default function Editorial({
  eyebrow,
  title,
  children,
  reverse,
  cta,
  imageAngle,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  reverse?: boolean;
  cta?: ReactNode;
  imageAngle?: number;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className={reverse ? `${styles.editorial} ${styles.reverse}` : styles.editorial}>
      <Reveal className={styles.imageWrap}>
        {image ? (
          <Photo src={image} alt={imageAlt ?? eyebrow} className={styles.image} />
        ) : (
          <PlaceholderImage angle={imageAngle} className={styles.image} />
        )}
      </Reveal>
      <Reveal className={styles.copy} delay={120}>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children}
        {cta}
      </Reveal>
    </section>
  );
}

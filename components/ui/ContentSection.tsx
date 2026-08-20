import type { ReactNode } from "react";
import styles from "./ContentSection.module.css";

export default function ContentSection({
  title,
  children,
  cta,
}: {
  title?: ReactNode;
  children: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <section className={styles.section}>
      {title ? <h2>{title}</h2> : null}
      {children}
      {cta ? <div className={styles.actions}>{cta}</div> : null}
    </section>
  );
}

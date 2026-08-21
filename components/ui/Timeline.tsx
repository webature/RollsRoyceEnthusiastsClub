import Reveal from "./Reveal";
import styles from "./Timeline.module.css";

export default function Timeline({
  items,
}: {
  items: { date: string; title: string; body: string }[];
}) {
  return (
    <section className={styles.timeline}>
      {items.map((item, index) => (
        <Reveal key={item.date + item.title} delay={Math.min(index, 6) * 70}>
          <article className={styles.row}>
            <div className={styles.marker}>
              <span className={styles.dot} aria-hidden="true" />
            </div>
            <div>
              <span className={styles.date}>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </section>
  );
}

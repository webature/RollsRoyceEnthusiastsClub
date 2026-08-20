import styles from "./Timeline.module.css";

export default function Timeline({
  items,
}: {
  items: { date: string; title: string; body: string }[];
}) {
  return (
    <section className={styles.timeline}>
      {items.map((item) => (
        <article key={item.date + item.title} className={styles.row}>
          <span className={styles.date}>{item.date}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </section>
  );
}

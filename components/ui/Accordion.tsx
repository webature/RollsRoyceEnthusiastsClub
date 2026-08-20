import styles from "./Accordion.module.css";

export default function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <section className={styles.accordion}>
      {items.map((item, i) => (
        <details key={item.question} open={i === 0}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}

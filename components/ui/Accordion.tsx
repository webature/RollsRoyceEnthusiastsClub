import Reveal from "./Reveal";
import styles from "./Accordion.module.css";

export default function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <section className={styles.accordion}>
      {items.map((item, i) => (
        <Reveal key={item.question} delay={i * 60}>
          <details open={i === 0}>
            <summary>
              {item.question}
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        </Reveal>
      ))}
    </section>
  );
}

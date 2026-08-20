import Link from "next/link";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { href: "/about", label: "The Club" },
      { href: "/history", label: "Club History" },
      { href: "/foundation", label: "Foundation" },
      { href: "/archives", label: "Archive Services" },
    ],
  },
  {
    heading: "Join Us",
    links: [
      { href: "/membership", label: "Membership" },
      { href: "/events", label: "Events" },
      { href: "/sections", label: "Worldwide Sections" },
      { href: "/registers", label: "Model Registers" },
    ],
  },
  {
    heading: "Club",
    links: [
      { href: "/news", label: "News" },
      { href: "/publications", label: "Publications" },
      { href: "/affiliates", label: "Affiliates" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.grid} container`}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>RREC</div>
          <p>
            The international club for Rolls-Royce &amp; Bentley enthusiasts
            &mdash; owners and non-owners alike, since 1957.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading} className={styles.linkCol}>
            <span className={styles.colHeading}>{col.heading}</span>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className={`${styles.legal} container`}>
        Concept redesign for the Rolls-Royce Enthusiasts&rsquo; Club &middot;
        Placeholder imagery stands in for licensed photography &mdash; replace
        before production.
      </div>
    </footer>
  );
}

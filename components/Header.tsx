"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/about", label: "The Club" },
  { href: "/membership", label: "Membership" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/sections", label: "Sections" },
  { href: "/publications", label: "Publications" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" onClick={() => setOpen(false)}>
        RREC
        <small>Rolls-Royce Enthusiasts&rsquo; Club</small>
      </Link>
      <button
        type="button"
        className={styles.menuBtn}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>
      <nav className={open ? `${styles.nav} ${styles.open}` : styles.nav}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link className={styles.join} href="/membership" onClick={() => setOpen(false)}>
          Join
        </Link>
      </nav>
    </header>
  );
}

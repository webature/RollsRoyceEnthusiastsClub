"use client";

import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? `${styles.header} ${styles.scrolled}` : styles.header}>
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

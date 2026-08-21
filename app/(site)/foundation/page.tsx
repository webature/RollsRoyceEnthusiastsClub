import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Editorial from "@/components/ui/Editorial";
import ContentSection from "@/components/ui/ContentSection";
import Reveal from "@/components/ui/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sir Henry Royce Memorial Foundation",
  description: "Founded in 1977 by Eric Barrass OBE to safeguard the archives and legacy of Rolls-Royce and Bentley.",
};

export default function FoundationPage() {
  return (
    <>
      <PageHero
        eyebrow="Est. 1977 · Charity No. 1128686"
        title="Sir Henry Royce Memorial Foundation"
        intro="“Whatever is rightly done, however humble, is noble.” — Sir Henry Royce"
        image="/images/car-silver-london.jpg"
      />

      <Editorial
        eyebrow="Founded by Eric Barrass, OBE"
        title="A perpetual trust"
        image="/images/library-books.jpg"
        imageAlt="An archive library"
      >
        <p>
          The Foundation was formed in 1977 by Eric Barrass, OBE — then the
          RREC&rsquo;s General Secretary — as a perpetual charitable trust to
          provide a safe home for the archives of the Rolls-Royce Motor
          Division. It acquired and restored The Hunt House in Paulerspury,
          a Grade II listed building in Northamptonshire, as its permanent
          archive and headquarters.
        </p>
      </Editorial>

      <div className={styles.statsStrip}>
        <Reveal className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1977</span>
            <span className={styles.statLabel}>Founded</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>Grade II</span>
            <span className={styles.statLabel}>Listed — The Hunt House</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1128686</span>
            <span className={styles.statLabel}>Registered charity number</span>
          </div>
        </Reveal>
      </div>

      <ContentSection title="Preservation and public access.">
        <p>
          The Hunt House houses a working archive, cataloguing and preserving
          material, digitising technical drawings, and providing a research
          library, lecture hall and workshop open to members and researchers
          alike.
        </p>
        <p>
          The Foundation also supports engineering education, sponsoring the
          MoD Apprentice Medal, Arkwright Scholarships, the IET Ambition
          &amp; Achievement Awards and the Engineering Council&rsquo;s Young
          Engineer for Britain award — carrying Sir Henry Royce&rsquo;s
          engineering legacy forward to a new generation.
        </p>
      </ContentSection>
    </>
  );
}

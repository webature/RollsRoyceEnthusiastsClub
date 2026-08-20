import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive Services",
  description: "Research the history of a Rolls-Royce or Bentley motor car through the Club's archives.",
};

export default function ArchivesPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Archive Services"
        intro="Trace the history of a Rolls-Royce or Bentley motor car through the Club's records at The Hunt House."
        image="/images/library-books.jpg"
      />

      <ContentSection title="A record of every car.">
        <p>
          Catalogued so far: Shadow I &amp; II, Silver Wraith II, Corniche and
          Camargue (including Jack Barclay and H.R. Owen service records),
          with Silver Spirit, Phantom VI and Brooklands records in progress.
        </p>
      </ContentSection>

      <div className={styles.fees}>
        <div className={styles.fee}>
          <span>Build &amp; test records (digital)</span>
          <strong>£60 members / £120 non-members</strong>
        </div>
        <div className={styles.fee}>
          <span>Heritage Certificate</span>
          <strong>£40 members / £80 non-members</strong>
        </div>
        <div className={styles.fee}>
          <span>Information lookup (first query)</span>
          <strong>£10, +£5 per extra data point</strong>
        </div>
        <div className={styles.fee}>
          <span>Dating letter</span>
          <strong>£40</strong>
        </div>
        <div className={styles.fee}>
          <span>Agreed valuation (members only)</span>
          <strong>£75</strong>
        </div>
        <div className={styles.fee}>
          <span>DVLA registration retrieval assistance</span>
          <strong>£50</strong>
        </div>
      </div>

      <ContentSection
        title="Requesting a search"
        cta={
          <Link className="textLink" href="/foundation">
            About the Sir Henry Royce Memorial Foundation →
          </Link>
        }
      >
        <p>
          Members can request an archive search through the Club office.
          Non-members should contact{" "}
          <a className="textLink" href="mailto:records@rrec.org.uk">
            records@rrec.org.uk
          </a>
          . All fees shown include VAT.
        </p>
      </ContentSection>
    </>
  );
}

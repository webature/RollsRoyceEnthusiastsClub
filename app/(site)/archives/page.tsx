import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import Reveal from "@/components/ui/Reveal";
import styles from "./page.module.css";

const FEES = [
  { service: "Build & test records (digital)", price: "£60 members / £120 non-members" },
  { service: "Heritage Certificate", price: "£40 members / £80 non-members" },
  { service: "Information lookup (first query)", price: "£10, +£5 per extra data point" },
  { service: "Dating letter", price: "£40" },
  { service: "Agreed valuation (members only)", price: "£75" },
  { service: "DVLA registration retrieval assistance", price: "£50" },
];

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
        {FEES.map((fee, index) => (
          <Reveal key={fee.service} delay={Math.min(index, 6) * 60}>
            <div className={styles.fee}>
              <span>{fee.service}</span>
              <strong>{fee.price}</strong>
            </div>
          </Reveal>
        ))}
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

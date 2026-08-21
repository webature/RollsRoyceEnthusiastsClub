import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import Reveal from "@/components/ui/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Rolls-Royce Enthusiasts' Club.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        image="/images/car-bentley.jpg"
      />

      <ContentSection>
        <p>
          For membership, publications and general enquiries, reach the
          Club office at{" "}
          <a className="textLink" href="mailto:hello@rrec.org.uk">
            hello@rrec.org.uk
          </a>
          . For archive research requests, contact{" "}
          <a className="textLink" href="mailto:records@rrec.org.uk">
            records@rrec.org.uk
          </a>
          .
        </p>
      </ContentSection>

      <div className={styles.grid}>
        <Reveal className={styles.card}>
          <p className="eyebrow">Club office</p>
          <h3>The Granary</h3>
          <p>Pury Hill Business Park</p>
          <p>Alderton Road, Towcester</p>
          <p>Northamptonshire, NN12 7LS</p>
          <p>
            Open to members on request, with advance notice — get in touch
            first at{" "}
            <a href="mailto:hello@rrec.org.uk">hello@rrec.org.uk</a>.
          </p>
        </Reveal>
        <Reveal className={styles.card} delay={120}>
          <p className="eyebrow">Archive &amp; foundation</p>
          <h3>The Hunt House</h3>
          <p>Paulerspury</p>
          <p>Northamptonshire</p>
          <p>Grade II listed home of the Sir Henry Royce Memorial Foundation.</p>
          <p>Open to visitors — free for members, chargeable for non-members.</p>
        </Reveal>
      </div>
    </>
  );
}

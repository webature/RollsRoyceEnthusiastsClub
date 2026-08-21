import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import CardsGrid from "@/components/ui/CardsGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Membership",
  description: "Join the international club for Rolls-Royce and Bentley enthusiasts.",
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Join the Club"
        title="Membership"
        intro="Open to anyone with a genuine interest in Rolls-Royce and Bentley motor cars — owners and non-owners alike."
        image="/images/library-books.jpg"
      />

      <ContentSection title="What membership includes">
        <p>
          Membership connects you to a worldwide community: local Sections,
          Model Registers, national and international events, technical
          seminars, a competitive insurance scheme, specialist tool rental,
          and free entry to The Hunt House archive &mdash; built up over
          nearly seven decades.
        </p>
        <p>
          Members receive <em>Spirit &amp; Speed</em> and <em>The Bulletin</em>{" "}
          in print or online, plus access to the Club&rsquo;s online vehicle
          database, forums and Club Shop.
        </p>
      </ContentSection>

      <div className={styles.pricing}>
        <div className={styles.tier}>
          <h3>E-Membership</h3>
          <div className={styles.rate}>
            <span>Single</span>
            <strong>£69 / yr</strong>
          </div>
          <Link className={`textLink ${styles.joinLink}`} href="/membership/join?tier=e-single">
            Join Single →
          </Link>
          <div className={styles.rate}>
            <span>Joint</span>
            <strong>£79 / yr</strong>
          </div>
          <Link className={`textLink ${styles.joinLink}`} href="/membership/join?tier=e-joint">
            Join Joint →
          </Link>
          <p className={styles.fee}>+ £35 joining fee, first year only.</p>
        </div>
        <div className={styles.tier}>
          <h3>Paper Membership</h3>
          <div className={styles.rate}>
            <span>Single</span>
            <strong>£95 / yr</strong>
          </div>
          <Link className={`textLink ${styles.joinLink}`} href="/membership/join?tier=paper-single">
            Join Single →
          </Link>
          <div className={styles.rate}>
            <span>Joint</span>
            <strong>£110 / yr</strong>
          </div>
          <Link className={`textLink ${styles.joinLink}`} href="/membership/join?tier=paper-joint">
            Join Joint →
          </Link>
          <p className={styles.fee}>+ £35 joining fee, first year only.</p>
        </div>
      </div>

      <ContentSection
        title="Ready to join?"
        cta={
          <>
            <Link className="btn btnDark" href="/membership/join">
              Join the Club →
            </Link>{" "}
            <Link className="textLink" href="/portal/login">
              Already a member? Sign in →
            </Link>
          </>
        }
      >
        <p>
          Choose your tier above and apply online, or get in touch directly
          at{" "}
          <a className="textLink" href="mailto:hello@rrec.org.uk">
            hello@rrec.org.uk
          </a>
          .
        </p>
      </ContentSection>

      <CardsGrid
        items={[
          {
            eyebrow: "Community",
            title: "Local Sections",
            body: "18 Sections in the UK and a further 18 worldwide — join or attend any of them.",
            href: "/sections",
            image: "/images/world-map.jpg",
          },
          {
            eyebrow: "Knowledge",
            title: "Model Registers",
            body: "Technical expertise and specialist support for your particular model.",
            href: "/registers",
            image: "/images/workshop-bw.jpg",
          },
          {
            eyebrow: "Reading",
            title: "Publications",
            body: "The Bulletin and Spirit & Speed, plus the annual RREC Yearbook.",
            href: "/publications",
            image: "/images/car-silver-london.jpg",
          },
        ]}
      />
    </>
  );
}

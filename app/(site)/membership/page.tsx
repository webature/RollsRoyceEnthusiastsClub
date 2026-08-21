import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import CardsGrid from "@/components/ui/CardsGrid";
import Reveal from "@/components/ui/Reveal";
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
        <Reveal className={`${styles.tier} ${styles.tierFeatured}`}>
          <span className={styles.badge}>Most popular</span>
          <p className="eyebrow">Digital</p>
          <h3>E-Membership</h3>
          <p className={styles.tierDesc}>
            All the benefits of membership, delivered instantly, online.
          </p>
          <ul className={styles.benefits}>
            <li>Spirit &amp; Speed and The Bulletin, delivered online</li>
            <li>Instant access — no waiting for the post</li>
            <li>Full access to Sections, Registers and events</li>
          </ul>
          <div className={styles.rates}>
            <div className={styles.rate}>
              <div>
                <span>Single</span>
                <strong>
                  £69<small>/yr</small>
                </strong>
              </div>
              <Link className={styles.rateJoin} href="/membership/join?tier=e-single">
                Join →
              </Link>
            </div>
            <div className={styles.rate}>
              <div>
                <span>Joint</span>
                <strong>
                  £79<small>/yr</small>
                </strong>
              </div>
              <Link className={styles.rateJoin} href="/membership/join?tier=e-joint">
                Join →
              </Link>
            </div>
          </div>
          <p className={styles.fee}>+ £35 joining fee, first year only.</p>
        </Reveal>
        <Reveal className={styles.tier} delay={120}>
          <p className="eyebrow">Print</p>
          <h3>Paper Membership</h3>
          <p className={styles.tierDesc}>
            The full experience, with Spirit &amp; Speed and The Bulletin posted
            to your door.
          </p>
          <ul className={styles.benefits}>
            <li>Spirit &amp; Speed and The Bulletin, posted each issue</li>
            <li>A printed keepsake to keep and collect</li>
            <li>Full access to Sections, Registers and events</li>
          </ul>
          <div className={styles.rates}>
            <div className={styles.rate}>
              <div>
                <span>Single</span>
                <strong>
                  £95<small>/yr</small>
                </strong>
              </div>
              <Link className={styles.rateJoin} href="/membership/join?tier=paper-single">
                Join →
              </Link>
            </div>
            <div className={styles.rate}>
              <div>
                <span>Joint</span>
                <strong>
                  £110<small>/yr</small>
                </strong>
              </div>
              <Link className={styles.rateJoin} href="/membership/join?tier=paper-joint">
                Join →
              </Link>
            </div>
          </div>
          <p className={styles.fee}>+ £35 joining fee, first year only.</p>
        </Reveal>
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

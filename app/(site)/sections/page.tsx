import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import Editorial from "@/components/ui/Editorial";
import Reveal from "@/components/ui/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Worldwide Sections",
  description: "18 Sections in the UK and a further 18 across the rest of the world.",
};

export default function SectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Worldwide Sections"
        intro="18 Sections in the UK, and a further 18 across the rest of the world."
        image="/images/world-map.jpg"
      />

      <Reveal className={styles.bigNumber}>
        <span className={styles.number}>36</span>
        <div>
          <p className={styles.numberLabel}>Sections, worldwide</p>
          <p className={styles.numberBreakdown}>18 across the UK, and a further 18 internationally.</p>
        </div>
      </Reveal>

      <ContentSection title="A local welcome, everywhere.">
        <p>
          Sections are the social heart of the Club — each run by its own
          committee, organising technical events, weekend breaks, visits and
          social gatherings for members nearby. Members are welcome to join
          or attend the activities of any Section, not only the one closest
          to home.
        </p>
        <p>
          Section newsletters run alongside the Club&rsquo;s national
          publications, and many Sections organise the rallies and tours
          featured on the Club&rsquo;s events calendar — from regular pub
          meets to weekend rallies abroad.
        </p>
      </ContentSection>

      <Editorial
        eyebrow="Get involved"
        title="Join your nearest Section"
        image="/images/car-bentley.jpg"
        imageAlt="A Bentley at a Section gathering"
        reverse
      >
        <p>
          New members are welcomed at every Section meeting — enthusiasm is
          the only requirement. Contact the Club office to be put in touch
          with your nearest Section organiser.
        </p>
      </Editorial>
    </>
  );
}

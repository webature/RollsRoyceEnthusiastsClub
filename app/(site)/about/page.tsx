import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import Editorial from "@/components/ui/Editorial";

export const metadata: Metadata = {
  title: "The Club",
  description: "The international home for anyone with a genuine interest in Rolls-Royce and Bentley motor cars.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The RREC"
        title="The Club"
        intro="The international home for anyone, whether an owner or non-owner, with an interest in the motor car products of Rolls-Royce and Bentley."
        image="/images/car-silver-shadow.jpg"
      />

      <ContentSection title="Enthusiasm comes first.">
        <p>
          The Rolls-Royce Enthusiasts&rsquo; Club is an international
          community built around a shared appreciation of the cars, people,
          engineering and heritage of Rolls-Royce and Bentley &mdash;
          enthusiast rather than owner. Members welcome anyone drawn to the
          legacy of Sir Henry Royce and Charles Stewart Rolls, and to the
          cars their successors went on to build.
        </p>
        <p>
          At its heart are local Sections, Model Registers, events,
          publications and technical resources that connect enthusiasts
          across generations and borders.
        </p>
        <p>
          It began in 1957, when eleven founding members answered an
          advertisement in the Oxford Mail and met at Paternoster Farm,
          Yarnton — the first of what would become a worldwide community of
          thousands, spanning 18 Sections in the UK and a further 18 abroad.{" "}
          <Link className="textLink" href="/history">
            Read the full story →
          </Link>
        </p>
      </ContentSection>

      <Editorial
        eyebrow="Structure"
        title="Sections and Registers"
        image="/images/workshop-bw.jpg"
        imageAlt="A classic car workshop"
      >
        <p>
          The Club is organised around two complementary structures: local{" "}
          <Link className="textLink" href="/sections">Sections</Link> that
          bring members together socially wherever they are in the world, and{" "}
          <Link className="textLink" href="/registers">Model Registers</Link>{" "}
          dedicated to the technical knowledge and history of individual
          Rolls-Royce and Bentley models.
        </p>
      </Editorial>

      <ContentSection title="Publications & correspondence">
        <p>
          Members receive the Club&rsquo;s publications every month,
          distributed globally and available for online download, alongside
          newsletters from their local Section.
        </p>
        <p>
          The Club&rsquo;s administrative office is based at The Granary,
          Pury Hill Business Park, Towcester &mdash; separate from The Hunt
          House in Paulerspury, home to the Sir Henry Royce Memorial
          Foundation&rsquo;s archive.{" "}
          <Link className="textLink" href="/contact">
            Get in touch →
          </Link>
        </p>
      </ContentSection>
    </>
  );
}

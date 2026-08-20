import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import CardsGrid from "@/components/ui/CardsGrid";

export const metadata: Metadata = {
  title: "Affiliates",
  description: "Only partnering with quality — the businesses and organisations affiliated with the RREC.",
};

export default function AffiliatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Only partnering with quality"
        title="Affiliates"
        intro="Specialists and organisations recognised by the Club for their standing with Rolls-Royce and Bentley owners."
        image="/images/car-silver-london.jpg"
      />

      <ContentSection title="Recommended by the Club.">
        <p>
          The Club joined the Historic &amp; Classic Vehicles Alliance (HCVA)
          in 2026, adding its voice to the wider effort protecting the future
          of historic motoring. A full directory of affiliated businesses is
          published each year in the RREC Yearbook Affiliates guide.
        </p>
      </ContentSection>

      <CardsGrid
        items={[
          {
            eyebrow: "Insurance",
            title: "Howden Classics",
            body: "Specialist Rolls-Royce and Bentley insurance at preferential member rates since 1977, with agreed value cover up to £100,000.",
            image: "/images/car-silver-shadow.jpg",
          },
          {
            eyebrow: "Parts",
            title: "Flying Spares",
            body: "Parts for every Rolls-Royce and Bentley model from 1946 onwards, with member discounts.",
            image: "/images/workshop-bw.jpg",
          },
          {
            eyebrow: "Publishing",
            title: "St James's House",
            body: "London publisher and partner of over ten years on the RREC Yearbook and Club publications.",
            image: "/images/library-books.jpg",
          },
        ]}
      />
    </>
  );
}

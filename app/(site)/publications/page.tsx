import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import CardsGrid from "@/components/ui/CardsGrid";

export const metadata: Metadata = {
  title: "Publications",
  description: "Spirit & Speed, The Bulletin and the RREC Yearbook — the Club's publications since 1960.",
};

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reading"
        title="Publications"
        intro="Award-winning member publications connecting the Club across the world."
        image="/images/library-books.jpg"
      />

      <ContentSection title="Written by enthusiasts, for enthusiasts.">
        <p>
          RREC publications carry Club news, technical articles, event
          reports, register updates and specialist interviews, distributed
          to members worldwide in print or online.
        </p>
      </ContentSection>

      <CardsGrid
        items={[
          {
            eyebrow: "Magazine",
            title: "Spirit & Speed",
            body: "The Club's award-winning member magazine — marque features, Section news, register updates and event coverage.",
            image: "/images/car-silver-london.jpg",
          },
          {
            eyebrow: "Since 1960",
            title: "The Bulletin",
            body: "The Club's original publication, running continuously since February 1960.",
            image: "/images/library-books.jpg",
          },
          {
            eyebrow: "Annual",
            title: "RREC Yearbook",
            body: "A hardcover annual produced with publisher St James's House since 2007. The latest edition: “Strive for Perfection — The Official Platinum Jubilee Edition.”",
            image: "/images/car-bentley.jpg",
          },
        ]}
      />
    </>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Accordion from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about joining and being part of the RREC.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Frequently Asked Questions"
        image="/images/world-map.jpg"
      />

      <Accordion
        items={[
          {
            question: "What are the benefits of joining?",
            answer:
              "Monthly publications, access to the online and digital archive, local Section social events, access to the Club Shop, a competitive insurance scheme, free entry to The Hunt House, national and international tours, technical seminars, and specialist tool rental.",
          },
          {
            question: "How do I join?",
            answer:
              "It's simple — apply through the Club's membership portal, or get in touch at hello@rrec.org.uk and the team will set you up.",
          },
          {
            question: "Do I need to own a Rolls-Royce or Bentley?",
            answer:
              "No. The RREC is an enthusiasts' club and welcomes people with a genuine interest in the marques, whether or not they own a car.",
          },
          {
            question: "Can non-members visit the Club's headquarters?",
            answer:
              "Yes — The Hunt House in Paulerspury is open to visitors, though there is a charge for non-members (members visit free). Contact hello@rrec.org.uk to arrange a visit.",
          },
        ]}
      />
    </>
  );
}

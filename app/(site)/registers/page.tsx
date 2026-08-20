import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import Editorial from "@/components/ui/Editorial";

export const metadata: Metadata = {
  title: "Model Registers",
  description: "Specialist knowledge and technical support for individual Rolls-Royce and Bentley models.",
};

export default function RegistersPage() {
  return (
    <>
      <PageHero
        eyebrow="The Motor Cars"
        title="Model Registers"
        intro="Specialist knowledge, shared experience and a passion for individual models."
        image="/images/car-bentley.jpg"
      />

      <ContentSection title="Knowledge passed on.">
        <p>
          Model Registers bring together enthusiasts with detailed knowledge
          of particular Rolls-Royce and Bentley motor cars, supporting
          technical exchange, events and driving tours specific to each
          model.
        </p>
        <p>
          Register members are often the deepest source of technical
          expertise in the Club — restoring, maintaining and documenting
          their cars, and sharing what they learn with newer owners.
        </p>
      </ContentSection>

      <Editorial
        eyebrow="Technical support"
        title="Owning a classic, well supported"
        image="/images/workshop-bw.jpg"
        imageAlt="A classic car workshop"
      >
        <p>
          Whichever model brought you to Rolls-Royce or Bentley, a Register
          exists to help — from parts and provenance to the finer points of
          maintenance and originality.
        </p>
      </Editorial>
    </>
  );
}

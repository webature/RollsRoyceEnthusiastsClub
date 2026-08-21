import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import JoinForm from "@/components/JoinForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Join",
  description: "Join the Rolls-Royce Enthusiasts' Club.",
};

export default async function JoinPage(props: PageProps<"/membership/join">) {
  const searchParams = await props.searchParams;
  const tierParam = searchParams?.tier;
  const initialTier = Array.isArray(tierParam) ? tierParam[0] : tierParam;

  return (
    <>
      <PageHero eyebrow="Join the Club" title="Become a Member" image="/images/car-bentley.jpg" />
      <div className={styles.wrap}>
        <p>
          Choose your membership tier and enter your details — you&rsquo;ll be
          taken to Stripe to complete payment securely, then straight into
          your new membership account.
        </p>
        <JoinForm initialTier={typeof initialTier === "string" ? initialTier : undefined} />
      </div>
    </>
  );
}

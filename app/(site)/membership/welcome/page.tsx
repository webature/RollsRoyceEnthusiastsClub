import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ContentSection from "@/components/ui/ContentSection";
import { stripe, TIER_LABELS } from "@/lib/stripe";
import { activateMemberFromSubscription } from "@/lib/memberActivation";
import { completeMemberLoginAction } from "@/lib/actions/memberJoin";
import { prisma } from "@/lib/db";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Welcome",
};

export const dynamic = "force-dynamic";

export default async function WelcomePage(props: PageProps<"/membership/welcome">) {
  const searchParams = await props.searchParams;
  const sessionIdParam = searchParams?.session_id;
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam;

  if (!sessionId) {
    return (
      <>
        <PageHero eyebrow="Membership" title="No payment found" />
        <ContentSection>
          <p>
            We couldn&rsquo;t find a completed payment session.{" "}
            <Link className="textLink" href="/membership/join">
              Start over →
            </Link>
          </p>
        </ContentSection>
      </>
    );
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const memberId = checkoutSession.metadata?.memberId;
  const customerId = checkoutSession.customer;
  const subscription = checkoutSession.subscription;

  const isComplete =
    checkoutSession.payment_status === "paid" &&
    memberId &&
    typeof customerId === "string" &&
    subscription &&
    typeof subscription !== "string";

  if (!isComplete) {
    return (
      <>
        <PageHero eyebrow="Membership" title="Payment not confirmed yet" />
        <ContentSection>
          <p>
            Your payment hasn&rsquo;t been confirmed yet. If you completed
            checkout, this can take a moment — refresh this page, or{" "}
            <Link className="textLink" href="/contact">
              contact us
            </Link>{" "}
            if it doesn&rsquo;t resolve.
          </p>
        </ContentSection>
      </>
    );
  }

  await activateMemberFromSubscription(memberId, customerId, subscription);

  const member = await prisma.member.findUnique({ where: { id: memberId } });

  return (
    <>
      <PageHero eyebrow="Welcome" title="You're a member!" image="/images/car-silver-london.jpg" />
      <ContentSection
        title="Thank you for joining."
        cta={
          <form action={completeMemberLoginAction}>
            <input type="hidden" name="memberId" value={memberId} />
            <button type="submit" className="btn btnDark">
              Go to your account →
            </button>
          </form>
        }
      >
        <p>
          Your {member ? TIER_LABELS[member.tier] : "RREC"} membership is now
          active. A receipt has been sent to your email by Stripe. You can
          manage your billing and details any time from your account.
        </p>
      </ContentSection>
    </>
  );
}

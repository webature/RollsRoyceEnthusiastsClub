import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/memberAuth";
import { prisma } from "@/lib/db";
import { TIER_LABELS } from "@/lib/stripe";
import { openBillingPortalAction } from "@/lib/actions/memberBilling";
import { formatDate } from "@/lib/content";
import styles from "./portal.module.css";

const STATUS_CLASS: Record<string, string> = {
  active: styles.statusActive,
  past_due: styles.statusPastDue,
  canceled: styles.statusCanceled,
  pending: styles.statusPending,
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  past_due: "Payment overdue",
  canceled: "Canceled",
  pending: "Pending",
};

export default async function PortalDashboardPage() {
  const currentMember = await getCurrentMember();
  if (!currentMember) redirect("/portal/login");

  const member = await prisma.member.findUnique({ where: { id: currentMember.id } });
  if (!member) redirect("/portal/login");

  return (
    <>
      <div className={styles.header}>
        <h1>
          Welcome, {member.firstName} {member.lastName}
        </h1>
      </div>

      {member.status === "past_due" ? (
        <div className={styles.notice}>
          There was a problem taking payment for your membership. Please
          update your payment details using &ldquo;Manage billing&rdquo;
          below to keep your membership active.
        </div>
      ) : null}

      {member.status === "canceled" ? (
        <div className={styles.notice}>
          Your membership has been canceled. Contact the Club office if
          you&rsquo;d like to rejoin.
        </div>
      ) : null}

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <strong>{TIER_LABELS[member.tier] ?? member.tier}</strong>
          <span>Membership tier</span>
        </div>
        <div className={styles.statCard}>
          <span
            className={`${styles.status} ${STATUS_CLASS[member.status] ?? ""}`}
          >
            {STATUS_LABEL[member.status] ?? member.status}
          </span>
          <br />
          <span>Status</span>
        </div>
        <div className={styles.statCard}>
          <strong>
            {member.currentPeriodEnd ? formatDate(member.currentPeriodEnd) : "—"}
          </strong>
          <span>Renews</span>
        </div>
      </div>

      <div className={styles.actions}>
        <form action={openBillingPortalAction} className={styles.billingForm}>
          <button type="submit" className="btn btnDark">
            Manage billing →
          </button>
        </form>
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TIER_LABELS } from "@/lib/stripe";
import { formatDate } from "@/lib/content";
import { compMemberAction, cancelMemberAction } from "@/lib/actions/members";
import styles from "../../admin.module.css";

export default async function AdminMemberDetailPage(props: PageProps<"/admin/members/[id]">) {
  const { id } = await props.params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <>
      <div className={styles.header}>
        <h1>
          {member.firstName} {member.lastName}
        </h1>
      </div>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <strong>{TIER_LABELS[member.tier] ?? member.tier}</strong>
          <span>Tier</span>
        </div>
        <div className={styles.statCard}>
          <span
            className={`${styles.status} ${
              member.status === "active" ? styles.statusPublished : styles.statusDraft
            }`}
          >
            {member.status}
          </span>
          <br />
          <span>Status</span>
        </div>
        <div className={styles.statCard}>
          <strong>{member.currentPeriodEnd ? formatDate(member.currentPeriodEnd) : "—"}</strong>
          <span>Renews</span>
        </div>
      </div>

      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Email</th>
            <td>{member.email}</td>
          </tr>
          {member.secondaryName ? (
            <tr>
              <th>Second member</th>
              <td>{member.secondaryName}</td>
            </tr>
          ) : null}
          {member.phone ? (
            <tr>
              <th>Phone</th>
              <td>{member.phone}</td>
            </tr>
          ) : null}
          {member.addressLine1 ? (
            <tr>
              <th>Address</th>
              <td>
                {[
                  member.addressLine1,
                  member.addressLine2,
                  member.city,
                  member.postcode,
                  member.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
          ) : null}
          <tr>
            <th>Joined</th>
            <td>{formatDate(member.createdAt)}</td>
          </tr>
          <tr>
            <th>Stripe customer</th>
            <td>{member.stripeCustomerId ?? "—"}</td>
          </tr>
          <tr>
            <th>Stripe subscription</th>
            <td>{member.stripeSubscriptionId ?? "—"}</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.actions}>
        {member.status !== "active" ? (
          <form action={compMemberAction}>
            <input type="hidden" name="id" value={member.id} />
            <button type="submit" className="btn btnDark">
              Grant active membership
            </button>
          </form>
        ) : null}
        {member.status !== "canceled" ? (
          <form action={cancelMemberAction}>
            <input type="hidden" name="id" value={member.id} />
            <button type="submit" className="btn btnGhost">
              Cancel membership
            </button>
          </form>
        ) : null}
      </div>
    </>
  );
}

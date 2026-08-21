import Link from "next/link";
import { prisma } from "@/lib/db";
import { TIER_LABELS } from "@/lib/stripe";
import { formatDate } from "@/lib/content";
import styles from "../admin.module.css";

const STATUS_CLASS: Record<string, string> = {
  active: styles.statusPublished,
  pending: styles.statusDraft,
  past_due: styles.statusDraft,
  canceled: styles.statusDraft,
};

export default async function AdminMembersListPage(props: PageProps<"/admin/members">) {
  const searchParams = await props.searchParams;
  const statusParam = searchParams?.status;
  const status = Array.isArray(statusParam) ? statusParam[0] : statusParam;

  const members = await prisma.member.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className={styles.header}>
        <h1>Members</h1>
      </div>

      <form method="get" className={styles.filterForm}>
        <select name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="past_due">Payment overdue</option>
          <option value="canceled">Canceled</option>
        </select>
        <button type="submit" className="btn btnGhost">
          Filter
        </button>
      </form>

      {members.length === 0 ? (
        <p className={styles.empty}>No members found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  {member.firstName} {member.lastName}
                </td>
                <td>{member.email}</td>
                <td>{TIER_LABELS[member.tier] ?? member.tier}</td>
                <td>
                  <span className={`${styles.status} ${STATUS_CLASS[member.status] ?? ""}`}>
                    {member.status}
                  </span>
                </td>
                <td>{formatDate(member.createdAt)}</td>
                <td>
                  <Link href={`/admin/members/${member.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./admin.module.css";

export default async function AdminDashboard() {
  const [postCount, publishedPostCount, eventCount, publishedEventCount, activeMemberCount, totalMemberCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.event.count(),
      prisma.event.count({ where: { status: "published" } }),
      prisma.member.count({ where: { status: "active" } }),
      prisma.member.count(),
    ]);

  return (
    <>
      <div className={styles.header}>
        <h1>Dashboard</h1>
      </div>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <strong>{postCount}</strong>
          <span>News posts ({publishedPostCount} published)</span>
        </div>
        <div className={styles.statCard}>
          <strong>{eventCount}</strong>
          <span>Events ({publishedEventCount} published)</span>
        </div>
        <div className={styles.statCard}>
          <strong>{totalMemberCount}</strong>
          <span>Members ({activeMemberCount} active)</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link className="btn btnDark" href="/admin/news/new">
          + New news post
        </Link>
        <Link className="btn btnGhost" href="/admin/events/new">
          + New event
        </Link>
        <Link className="btn btnGhost" href="/admin/members">
          View members
        </Link>
      </div>
    </>
  );
}

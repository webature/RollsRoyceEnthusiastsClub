import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import styles from "./layout.module.css";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.brand} href="/admin">
          RREC Admin
        </Link>
        <nav className={styles.nav}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/news">News</Link>
          <Link href="/admin/events">Events</Link>
        </nav>
        <div className={styles.who}>
          <span>{admin.email}</span>
          <form action={logoutAction}>
            <button type="submit" className={styles.logout}>
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/memberAuth";
import { memberLogoutAction } from "@/lib/actions/memberAuth";
import styles from "./layout.module.css";

export default async function PortalProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/portal/login");

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <Link className={styles.brand} href="/portal">
          RREC Membership
        </Link>
        <nav className={styles.nav}>
          <Link href="/portal">Dashboard</Link>
          <Link href="/portal/profile">Profile</Link>
        </nav>
        <div className={styles.who}>
          <span>{member.email}</span>
          <form action={memberLogoutAction}>
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

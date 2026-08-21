import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/memberAuth";
import { memberLogoutAction } from "@/lib/actions/memberAuth";
import AppNavLink from "@/components/AppNavLink";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", exact: true },
  { href: "/portal/profile", label: "Profile" },
];

export default async function PortalProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/portal/login");

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/portal">
          RREC <span className={styles.brandTag}>Membership</span>
        </Link>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <AppNavLink
              key={item.href}
              href={item.href}
              exact={item.exact}
              className={styles.navLink}
              activeClassName={styles.navLinkActive}
            >
              {item.label}
            </AppNavLink>
          ))}
        </nav>
        <div className={styles.who}>
          <span className={styles.whoEmail}>{member.email}</span>
          <form action={memberLogoutAction}>
            <button type="submit" className={styles.logout}>
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import AppNavLink from "@/components/AppNavLink";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/news", label: "News" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/members", label: "Members" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/admin">
          RREC <span className={styles.brandTag}>Admin</span>
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
          <span className={styles.whoEmail}>{admin.email}</span>
          <form action={logoutAction}>
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

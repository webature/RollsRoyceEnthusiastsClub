"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavLink({
  href,
  exact,
  className,
  activeClassName,
  children,
}: {
  href: string;
  exact?: boolean;
  className: string;
  activeClassName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={isActive ? `${className} ${activeClassName}` : className}>
      {children}
    </Link>
  );
}

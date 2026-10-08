"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const onApush = pathname?.startsWith("/apush");
  const onApchem = pathname?.startsWith("/apchem");
  const onSatrw = pathname?.startsWith("/satrw");

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="brand" aria-label="AP Practice home">
          <span className="brand-mark">AP</span>
          Practice
        </Link>
        <nav className="topnav-links" aria-label="Subjects">
          <Link
            href="/"
            className={!onApush && !onApchem && !onSatrw ? "active" : undefined}
          >
            Courses
          </Link>
          <Link href="/apush" className={onApush ? "active" : undefined}>
            APUSH
          </Link>
          <Link href="/apchem" className={onApchem ? "active" : undefined}>
            AP Chem
          </Link>
          <Link href="/satrw" className={onSatrw ? "active" : undefined}>
            SAT English
          </Link>
        </nav>
      </div>
    </header>
  );
}

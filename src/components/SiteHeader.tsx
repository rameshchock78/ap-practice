"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const onApush = pathname?.startsWith("/apush");
  const onApchem = pathname?.startsWith("/apchem");

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="brand" aria-label="AP Practice home">
          <span className="brand-mark">AP</span>
          Practice
        </Link>
        <nav className="topnav-links" aria-label="Subjects">
          <Link href="/" className={!onApush && !onApchem ? "active" : undefined}>
            Courses
          </Link>
          <Link href="/apush" className={onApush ? "active" : undefined}>
            APUSH
          </Link>
          <Link href="/apchem" className={onApchem ? "active" : undefined}>
            AP Chem
          </Link>
        </nav>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "AP Practice — US History & Chemistry",
  description:
    "Practice bank for AP U.S. History and AP Chemistry with standard and trap MCQs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <main>
          <header className="site-header">
            <Link href="/" className="brand">
              AP <span>Practice</span>
            </Link>
            <Link href="/" className="nav-link">
              Subjects
            </Link>
          </header>
          {children}
          <p className="foot">
            Original and open-license practice items only. Not affiliated with the
            College Board. Show source and license notes on each answer. Wikipedia-
            derived material may require CC BY-SA attribution.
          </p>
        </main>
      </body>
    </html>
  );
}

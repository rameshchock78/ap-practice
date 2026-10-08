import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AP Practice — APUSH, AP Chem & SAT English",
  description:
    "Free practice for AP U.S. History, AP Chemistry, and Digital SAT Reading & Writing with standard and trap MCQs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={body.variable}>
      <body>
        <div className="app-shell">
          <SiteHeader />
          <div className="page">{children}</div>
          <footer className="site-footer">
            <div className="page">
              Original and open-license practice items only. Not affiliated with
              the College Board or the SAT. Source and license notes appear with
              each explanation.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

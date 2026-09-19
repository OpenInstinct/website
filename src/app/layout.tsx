import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Arrow, Mark } from "@/components/icons";
import { REPO_URL } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "openinstinct",
  description:
    "An open decision model: text and questions go in, probabilities over your own options come out, in one forward pass.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteNav />
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="site-footer">
          <div className="site-container footer-inner">
            <div><Link href="/" className="brand"><Mark />openinstinct<span className="brand-dot">.</span></Link><p>An open model for the decisions ahead.</p></div>
            <div className="footer-links"><Link href="/playground">Playground</Link><Link href="/results">Evaluation</Link><a href={REPO_URL}>GitHub <Arrow diagonal /></a></div>
          </div>
          <div className="site-container footer-bottom"><span>Independent research. Built in the open.</span><span>openinstinct · Phase 2 checkpoint</span></div>
        </footer>
      </body>
    </html>
  );
}

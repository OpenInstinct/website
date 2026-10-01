import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Arrow, Mark } from "@/components/icons";
import { CONSOLE_URL, DOCS_URL } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "OpenInstinct — Decision intelligence with Instinct One",
  description:
    "Turn text, images, and structured data into decisions with Instinct One. Explore the model in the OpenInstinct console and integrate through the API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        <script src="https://a.solvie.me/api/script.js?siteId=7b8224557475" defer></script>
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteNav />
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="site-footer">
          <div className="site-container footer-inner">
            <div><Link href="/" className="brand"><Mark />openinstinct<span className="brand-dot">.</span></Link><p>Decision intelligence for the next move.</p></div>
            <div className="footer-links"><a href={DOCS_URL}>Documentation</a><Link href="/#access">Model access</Link><a href={CONSOLE_URL}>Console <Arrow diagonal /></a></div>
          </div>
          <div className="site-container footer-bottom"><span>© OpenInstinct. All rights reserved.</span><span>Instinct One · Available via API</span></div>
        </footer>
      </body>
    </html>
  );
}

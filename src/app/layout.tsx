import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
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
    "An open decision model on Qwen3: text and questions go in, probabilities over your own options come out, in one forward pass.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-line">
          <nav className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-4 sm:px-8">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight">
              openinstinct
            </Link>
            <div className="ml-auto flex items-center gap-5 text-sm">
              <Link href="/#results" className="hidden hover:text-signal sm:block">
                Results
              </Link>
              <Link href="/#status" className="hidden hover:text-signal sm:block">
                Status
              </Link>
              <a href={REPO_URL} className="hover:text-signal">
                GitHub
              </a>
              <Link
                href="/playground"
                className="rounded-full bg-ink px-4 py-2 font-medium text-ground hover:bg-signal"
              >
                Open playground
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:px-8">
            <p className="max-w-[70ch]">
              openinstinct is an independent open-source project. It is not affiliated with TypeSafe
              and is not a reproduction of Jev.
            </p>
            <a href={REPO_URL} className="shrink-0 text-ink underline sm:ml-auto">
              Source on GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

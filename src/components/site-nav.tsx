"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Arrow, Mark } from "@/components/icons";
import { CONSOLE_URL, DOCS_URL } from "@/lib/site";

const links = [
  { href: "/#model", label: "Instinct One" },
  { href: "/#use-cases", label: "Use cases" },
  { href: DOCS_URL, label: "Documentation" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="site-header">
    <nav className="site-container nav-inner" aria-label="Main navigation">
      <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="openinstinct home"><Mark />openinstinct<span className="brand-dot">.</span></Link>
      <div className="desktop-nav">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</div>
      <a href={CONSOLE_URL} className="button button-dark nav-cta" onClick={() => setOpen(false)}>Console <Arrow diagonal /></a>
      <button className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><span /> <span /></button>
    </nav>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<Arrow /></Link>)}</nav>}
  </header>;
}

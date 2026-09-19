import type { SVGProps } from "react";

export function Mark({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" {...props}><path d="M5 22V10l11-6 11 6v12l-11 6-11-6Z" stroke="currentColor" strokeWidth="1.7"/><path d="m5 10 11 6 11-6M16 16v12M10.5 7l11 6v6l-11 6V13l11-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}

export function Arrow({ diagonal = false, ...props }: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{diagonal ? <path d="M6 18 18 6M6 6h12v12"/> : <path d="M4 12h16m-6-6 6 6-6 6"/>}</svg>;
}

export function Check() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>;
}

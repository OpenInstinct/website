import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — OpenInstinct",
  description: "What OpenInstinct collects, what it does not store, and how to reach us about your data.",
};

export default function PrivacyPage() {
  return <article className="site-container legal">
    <p className="eyebrow">LEGAL</p>
    <h1>Privacy Policy</h1>
    <p className="legal-updated">Last updated: {LEGAL_UPDATED}</p>

    <p>OpenInstinct is an independent project based in Turkey. It is not yet an incorporated company. This policy covers the website at openinstinct.dev, the console, and the OpenInstinct API. Questions about it go to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

    <h2>Content you send to the API</h2>
    <p>Requests to the API and the console playground contain the text, images, and questions you want a decision on. We process that content in memory to produce the response and then discard it.</p>
    <ul>
      <li>We do not store the text, images, questions, or results of your requests.</li>
      <li>We do not use them to train or evaluate models.</li>
      <li>We do not share them with anyone, other than the infrastructure providers that run the request.</li>
    </ul>

    <h2>What we do keep</h2>
    <p><strong>Account data.</strong> Your name, email address, and sign-in details. If you sign in with Google, we receive your name, email address, and profile picture from Google.</p>
    <p><strong>Usage records.</strong> For each request we record a request ID, the workspace and API key it belongs to, the endpoint and model, the response status, token counts, cost, timing, and the time of the request. These records contain no request content. We use them for billing, rate limits, and the usage pages in the console.</p>
    <p><strong>Website analytics.</strong> The website and console use a self-hosted analytics tool that counts page views and records general information such as referrer, browser, and country. We do not use advertising trackers.</p>
    <p><strong>Email.</strong> If you write to us, we keep the conversation so that we can answer.</p>

    <h2>How we use it</h2>
    <p>We use this data to run the service: to sign you in, to count usage against your balance, to prevent abuse, to send service emails about your account, and to understand how the product is used. We do not sell personal data.</p>

    <h2>Who else handles it</h2>
    <p>We rely on infrastructure providers to operate the service, including Cloudflare for hosting and networking, Modal for GPU inference, and Google if you choose Google sign-in. They process data on our behalf, only as needed to provide their service. Inference runs in the EU.</p>

    <h2>How long we keep it</h2>
    <p>Account data and usage records are kept while your account exists. When you ask us to delete your account, we delete your account data and the usage records tied to it, unless we are required by law to keep something longer.</p>

    <h2>Your choices</h2>
    <p>You can ask for a copy of your data, a correction, or deletion of your account by writing to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. API keys can be revoked in the console at any time.</p>

    <h2>Changes</h2>
    <p>If this policy changes, we will update this page and the date above. For changes that affect how request content is handled, we will also notify account holders by email before the change takes effect.</p>

    <p className="legal-related">See also the <Link href="/terms">Terms of Service</Link>.</p>
  </article>;
}

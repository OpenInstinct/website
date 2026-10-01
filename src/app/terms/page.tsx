import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service — OpenInstinct",
  description: "The terms for using the OpenInstinct website, console, and API.",
};

export default function TermsPage() {
  return <article className="site-container legal">
    <p className="eyebrow">LEGAL</p>
    <h1>Terms of Service</h1>
    <p className="legal-updated">Last updated: {LEGAL_UPDATED}</p>

    <p>These terms apply to the OpenInstinct website, console, and API (the “service”). OpenInstinct is an independent project based in Turkey and is not yet an incorporated company. By creating an account or using the API, you agree to these terms. If you do not agree, do not use the service.</p>

    <h2>Your account</h2>
    <p>You need an account to use the console and the API. Keep your sign-in details and API keys confidential. You are responsible for activity under your account and keys. If a key is exposed, revoke it in the console and tell us.</p>

    <h2>Acceptable use</h2>
    <p>You may not use the service to:</p>
    <ul>
      <li>break the law or infringe the rights of others;</li>
      <li>send content you do not have the right to process;</li>
      <li>probe, disrupt, or overload the service, or get around rate limits and usage limits;</li>
      <li>extract model weights or attempt to reproduce the model from its outputs;</li>
      <li>resell access without our written agreement.</li>
    </ul>
    <p>We may suspend an account that violates these rules or puts the service at risk.</p>

    <h2>Your content</h2>
    <p>You keep all rights to the content you send and to the results you receive. You give us permission to process that content only to produce the response. We do not store it or use it for training; the <Link href="/privacy">Privacy Policy</Link> describes this in detail.</p>

    <h2>The model and its results</h2>
    <p>Instinct One is a proprietary model. These terms give you the right to use it through the API; they do not give you rights to the model itself.</p>
    <p>Results are probabilistic and can be wrong. You are responsible for how you use them. Do not rely on the service as the only safeguard where an error could cause injury, serious financial loss, or a decision with legal effect on a person.</p>

    <h2>Pricing and credit</h2>
    <p>Usage is charged against your workspace balance at the prices shown in the console. Promotional credit has no cash value, cannot be transferred, and may expire. Prices may change; changes apply to usage after they are published.</p>

    <h2>Availability</h2>
    <p>The service is at an early stage. We may change, limit, or discontinue features and models, and we do not promise uninterrupted availability. We will try to give notice before removing a model that is in use.</p>

    <h2>Disclaimer and liability</h2>
    <p>The service is provided “as is”, without warranties of any kind, to the extent the law allows. To the extent the law allows, our total liability for any claim related to the service is limited to the amount you paid us in the three months before the claim, and we are not liable for indirect or consequential losses.</p>

    <h2>Ending use</h2>
    <p>You may stop using the service and ask us to delete your account at any time. We may suspend or close accounts that violate these terms.</p>

    <h2>Changes</h2>
    <p>We may update these terms. We will update this page and the date above, and notify account holders by email of material changes. Continuing to use the service after a change means you accept the updated terms.</p>

    <h2>Contact</h2>
    <p>Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
  </article>;
}

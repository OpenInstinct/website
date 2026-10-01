import { permanentRedirect } from "next/navigation";

// Retired research page. Do not serve old evaluation artifacts at this URL.
export default function ResultsPage() {
  permanentRedirect("/#model");
}

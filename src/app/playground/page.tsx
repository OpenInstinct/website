import { redirect } from "next/navigation";
import { CONSOLE_URL } from "@/lib/site";

export default function PlaygroundPage() {
  redirect(`${CONSOLE_URL}/playground`);
}

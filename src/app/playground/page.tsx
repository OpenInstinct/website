import type { Metadata } from "next";
import { connection } from "next/server";
import { Playground } from "@/components/playground";
import { siteData } from "@/lib/site";

export const metadata: Metadata = { title: "Playground | openinstinct" };

export default async function PlaygroundPage() {
  await connection(); // read the env at request time, not at build time
  const live = Boolean(process.env.OPENINSTINCT_API_URL);
  return <Playground live={live} examples={siteData.examples} exampleRun={siteData.example_run} />;
}

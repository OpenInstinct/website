import type { Metadata } from "next";
import { connection } from "next/server";
import { Playground } from "@/components/playground";
import { siteData } from "@/lib/site";

export const metadata: Metadata = { title: "Playground | openinstinct" };

export default async function PlaygroundPage({ searchParams }: PageProps<"/playground">) {
  await connection(); // read the env at request time, not at build time
  const params = await searchParams;
  const initialExampleId = typeof params.example === "string" ? params.example : undefined;
  const live = Boolean(process.env.OPENINSTINCT_API_URL);
  return <Playground key={initialExampleId ?? "default"} initialExampleId={initialExampleId} live={live} examples={siteData.examples} exampleRun={siteData.example_run} />;
}

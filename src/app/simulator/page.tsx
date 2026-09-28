import type { Metadata } from "next";
import { SimulatorRoot } from "@/components/simulator/simulator-root";

export const metadata: Metadata = {
  title: "AI Debate Simulator — MUN Mastery",
  description: "Practice a full committee session against AI delegates with realistic geopolitical positions.",
};

export default async function SimulatorPage({ searchParams }: PageProps<"/simulator">) {
  const params = await searchParams;
  const search = Object.fromEntries(Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  return <SimulatorRoot key={JSON.stringify(search)} search={search} />;
}

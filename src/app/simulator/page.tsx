import type { Metadata } from "next";
import { SimulatorRoot } from "@/components/simulator/simulator-root";

export const metadata: Metadata = {
  title: "AI Debate Simulator — MUN Mastery",
  description: "Practice a full committee session against AI delegates with realistic geopolitical positions.",
};

export default function SimulatorPage() {
  return <SimulatorRoot />;
}

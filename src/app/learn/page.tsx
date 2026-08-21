import type { Metadata } from "next";
import { LearnIndex } from "@/components/learn/learn-index";

export const metadata: Metadata = {
  title: "Learn MUN — MUN Mastery",
  description: "Structured, interactive modules on rules of procedure, resolution writing, and strategy.",
};

export default function LearnPage() {
  return <LearnIndex />;
}

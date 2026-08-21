import type { Metadata } from "next";
import { PositionPaperGraderRoot } from "@/components/position-paper/position-paper-grader-root";

export const metadata: Metadata = {
  title: "Position Paper Grader — MUN Mastery",
  description: "Paste or upload a draft position paper for instant AI feedback and a score out of 100.",
};

export default function PositionPaperGraderPage() {
  return <PositionPaperGraderRoot />;
}

import type { Metadata } from "next";
import { CrisisRoot } from "@/components/crisis/crisis-root";

export const metadata: Metadata = {
  title: "Crisis Engine — MUN Mastery",
  description: "Live emergency updates and confidential directives for crisis committee practice.",
};

export default function CrisisPage() {
  return <CrisisRoot />;
}

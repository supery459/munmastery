import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — MUN Mastery",
  description: "Your delegate performance analytics, training log, and AI coaching.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}

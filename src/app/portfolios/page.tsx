import type { Metadata } from "next";
import { PortfolioHubRoot } from "@/components/portfolios/portfolio-hub-root";

export const metadata: Metadata = {
  title: "Portfolios — MUN Mastery",
  description: "Create and manage a dedicated workspace for each conference you're preparing for.",
};

export default function PortfoliosPage() {
  return <PortfolioHubRoot />;
}

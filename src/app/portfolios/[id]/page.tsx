import type { Metadata } from "next";
import { PortfolioDashboardRoot } from "@/components/portfolios/portfolio-dashboard-root";

export const metadata: Metadata = {
  title: "Conference Portfolio — MUN Mastery",
  description: "Everything tailored to one conference: position papers, speeches, notes, and targeted simulations.",
};

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioDashboardRoot portfolioId={id} />;
}

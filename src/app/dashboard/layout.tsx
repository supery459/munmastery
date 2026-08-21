import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/auth-gate";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TimeframeProvider } from "@/lib/timeframe-context";
import { HelpModalProvider } from "@/components/dashboard/help-context";

export const metadata: Metadata = {
  title: "Dashboard — MUN Mastery",
  description: "Your delegate performance analytics, training log, and AI coaching.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <TimeframeProvider>
        <HelpModalProvider>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="flex min-h-screen flex-col lg:pl-60">
              <Topbar />
              <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
          </div>
        </HelpModalProvider>
      </TimeframeProvider>
    </AuthGate>
  );
}

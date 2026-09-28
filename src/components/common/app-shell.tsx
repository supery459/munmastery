"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthGate } from "@/components/auth/auth-gate";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TimeframeProvider } from "@/lib/timeframe-context";
import { HelpModalProvider } from "@/components/dashboard/help-context";

const PROTECTED = ["/dashboard", "/simulator", "/speech-lab", "/position-paper-grader", "/crisis", "/learn", "/portfolios", "/settings", "/history"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (!PROTECTED.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return children;
  return <AuthGate><TimeframeProvider><HelpModalProvider>
    <div className="min-h-screen bg-background"><Sidebar />
      <div className="min-h-screen min-w-0 lg:pl-60"><Topbar key={pathname} />
        <div className={pathname === "/dashboard" ? "px-4 py-6 sm:px-6 lg:px-8" : ""}>{children}</div>
      </div>
    </div>
  </HelpModalProvider></TimeframeProvider></AuthGate>;
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bot,
  Calendar,
  FileText,
  Flame,
  FolderKanban,
  Gavel,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mic,
  Settings,
  Siren,
  Swords,
} from "lucide-react";
import { initialsFor, logOut } from "@/lib/user-store";
import { useCurrentUser } from "@/lib/auth-context";
import { useHelpModal } from "@/components/dashboard/help-context";

export const PRIMARY_NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Debate Simulator", href: "/simulator", icon: Swords },
  { label: "Crisis Engine", href: "/crisis", icon: Siren },
  { label: "Speech Analysis", href: "/speech-lab", icon: Mic },
  { label: "Learn MUN", href: "/learn", icon: GraduationCap },
  { label: "Position Paper Grader", href: "/position-paper-grader", icon: FileText },
  { label: "Portfolios", href: "/portfolios", icon: FolderKanban },
  { label: "Performance", href: "/dashboard#performance", icon: BarChart3 },
  { label: "Training log", href: "/dashboard#training", icon: Flame },
  { label: "AI Coach", href: "/dashboard#coach", icon: Bot },
  { label: "Conferences", href: "/dashboard#hub", icon: Calendar },
];

/**
 * Anchor links (href containing "#") never get their own highlighted state —
 * they all live on /dashboard, so the "Overview" entry stays the one active
 * item on that page. Every other entry matches on its own route, including
 * nested routes (e.g. /learn/clause-structure or /portfolios/abc123), so the
 * highlight tracks wherever navigation actually took you.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SECONDARY_NAV = [{ label: "Settings", href: "/settings", icon: Settings }];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const openHelp = useHelpModal();

  function handleLogOut() {
    logOut();
    router.push("/");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-panel-border bg-panel lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
          <Gavel className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
        </span>
        <span className="text-sm font-semibold tracking-wide text-foreground">
          MUN MASTERY
        </span>
      </Link>

      <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-3 pb-5">
        <div>
          <p className="px-3 pb-2 pt-4 text-[11px] font-medium uppercase tracking-wider text-foreground-muted/70">
            Dashboard
          </p>
          <ul className="flex flex-col gap-0.5">
            {PRIMARY_NAV.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/[0.06] text-foreground"
                        : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${isActive ? "text-accent-cyan" : ""}`}
                      strokeWidth={1.75}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="px-3 pb-2 pt-6 text-[11px] font-medium uppercase tracking-wider text-foreground-muted/70">
            Support
          </p>
          <ul className="flex flex-col gap-0.5">
            {SECONDARY_NAV.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/[0.06] text-foreground"
                        : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={openHelp}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-foreground-muted transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
                Help & docs
              </button>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <div className="panel-hover flex items-center gap-3 rounded-xl border border-panel-border p-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo text-xs font-semibold text-[#05070d]">
              {initialsFor(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-foreground">{user.name}</div>
              <div className="truncate text-[11px] text-foreground-muted">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogOut}
            className="flex items-center justify-center gap-2 rounded-lg border border-panel-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent-rose/30 hover:bg-accent-rose/10 hover:text-accent-rose"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
}

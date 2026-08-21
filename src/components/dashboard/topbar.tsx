"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Gavel, HelpCircle, LogOut, Menu, Settings, X } from "lucide-react";
import { PRIMARY_NAV, isNavItemActive } from "@/components/dashboard/sidebar";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { TimeframeDropdown } from "@/components/dashboard/timeframe-dropdown";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { useHelpModal } from "@/components/dashboard/help-context";
import { initialsFor, logOut } from "@/lib/user-store";
import { useCurrentUser } from "@/lib/auth-context";

export function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const openHelp = useHelpModal();
  const displayName = user.name;

  function handleLogOut() {
    setMobileNavOpen(false);
    logOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-panel-border bg-panel/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:pl-6">
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-white/[0.05] hover:text-foreground lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
            <Gavel className="h-3.5 w-3.5 text-accent-cyan" strokeWidth={1.75} />
          </span>
        </Link>

        <div className="hidden min-w-0 flex-col leading-tight lg:flex">
          <span className="text-[11px] text-foreground-muted">Delegate</span>
          <h1 className="text-sm font-semibold text-foreground">Overview</h1>
        </div>

        <GlobalSearch />

        <div className="ml-auto flex items-center gap-2">
          <TimeframeDropdown />
          <NotificationsPanel />

          <button
            onClick={handleLogOut}
            className="panel-hover hidden items-center gap-1.5 rounded-lg border border-panel-border px-3 py-2 text-xs font-medium text-foreground-muted hover:text-accent-rose sm:flex"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            Log Out
          </button>

          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo text-xs font-semibold text-[#05070d]"
            title={displayName}
          >
            {initialsFor(displayName)}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-panel-border lg:hidden"
          >
            <ul className="flex flex-col gap-0.5 p-3">
              {PRIMARY_NAV.map((item) => {
                const isActive = isNavItemActive(pathname, item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white/[0.06] text-foreground"
                          : "text-foreground-muted hover:bg-white/[0.05] hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-accent-cyan" : ""}`} strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/settings"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground-muted hover:bg-white/[0.05] hover:text-foreground"
                >
                  <Settings className="h-4 w-4" strokeWidth={1.75} />
                  Settings
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    openHelp();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-foreground-muted hover:bg-white/[0.05] hover:text-foreground"
                >
                  <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
                  Help & docs
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-foreground-muted hover:bg-white/[0.05] hover:text-accent-rose"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  Log Out
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

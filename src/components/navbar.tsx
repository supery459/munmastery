"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gavel, Menu, X } from "lucide-react";
import { useSignUpModal } from "@/components/marketing/signup-modal-context";

const NAV_LINKS = [
  { label: "First Conference", href: "#first-conference" },
  { label: "Explore", href: "#preview" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { openSignUp, openLogIn } = useSignUpModal();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="glow-cyan flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
            <Gavel className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold tracking-wide text-foreground">
            MUN MASTERY
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={openLogIn}
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            Sign in
          </button>
          <button
            onClick={openSignUp}
            className="glass-hover rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-cyan/20"
          >
            Create account
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-3 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openLogIn();
            }}
            className="rounded-lg px-3 py-2.5 text-center text-sm text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
          >
            Sign in
          </button>
          <button
            onClick={() => {
              setOpen(false);
              openSignUp();
            }}
            className="mt-1 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2.5 text-center text-sm font-medium text-foreground"
          >
            Create account
          </button>
        </motion.div>
      )}
    </header>
  );
}

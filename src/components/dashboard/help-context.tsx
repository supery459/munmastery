"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { HelpModal } from "@/components/dashboard/help-modal";

const HelpModalContext = createContext<(() => void) | null>(null);

export function HelpModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <HelpModalContext.Provider value={() => setOpen(true)}>
      {children}
      <HelpModal open={open} onClose={() => setOpen(false)} />
    </HelpModalContext.Provider>
  );
}

/** Returns a function that opens the Help & docs modal from anywhere inside <HelpModalProvider>. */
export function useHelpModal(): () => void {
  const ctx = useContext(HelpModalContext);
  if (!ctx) {
    throw new Error("useHelpModal must be used within a HelpModalProvider");
  }
  return ctx;
}

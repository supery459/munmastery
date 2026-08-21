"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SignUpModal } from "@/components/marketing/signup-modal";

type Mode = "signup" | "login";

type SignUpModalContextValue = {
  openSignUp: () => void;
  openLogIn: () => void;
};

const SignUpModalContext = createContext<SignUpModalContextValue | null>(null);

export function SignUpModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ open: false, mode: "signup" as Mode, sessionId: 0 });

  function open(mode: Mode) {
    // Bumping sessionId remounts the modal on every open, so its form state
    // starts fresh without resetting it imperatively in an effect.
    setState((s) => ({ open: true, mode, sessionId: s.sessionId + 1 }));
  }

  function closeModal() {
    setState((s) => ({ ...s, open: false }));
  }

  return (
    <SignUpModalContext.Provider value={{ openSignUp: () => open("signup"), openLogIn: () => open("login") }}>
      {children}
      <SignUpModal key={state.sessionId} open={state.open} mode={state.mode} onClose={closeModal} />
    </SignUpModalContext.Provider>
  );
}

/** Returns openers for the sign-up/log-in modal, usable anywhere in the marketing tree. */
export function useSignUpModal(): SignUpModalContextValue {
  const ctx = useContext(SignUpModalContext);
  if (!ctx) {
    throw new Error("useSignUpModal must be used within a SignUpModalProvider");
  }
  return ctx;
}

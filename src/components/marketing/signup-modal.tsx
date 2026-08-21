"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Gavel, Loader2, Mail, User, X } from "lucide-react";
import { logIn, signUp } from "@/lib/user-store";

type Mode = "signup" | "login";
type Status = "idle" | "submitting";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpModal({
  open,
  mode: initialMode,
  onClose,
}: {
  open: boolean;
  mode: Mode;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const focusId = window.setTimeout(() => firstFieldRef.current?.focus(), 50);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);

    return () => {
      window.clearTimeout(focusId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === "signup" && !name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    setStatus("submitting");
    window.setTimeout(() => {
      const result =
        mode === "signup"
          ? signUp({ name: name.trim(), email: email.trim(), password })
          : logIn({ email: email.trim(), password });

      if (!result.ok) {
        setStatus("idle");
        setError(result.error);
        return;
      }

      onClose();
      router.push("/dashboard");
    }, 500);
  }

  const heading = mode === "signup" ? "Create your account" : "Welcome back";
  const subheading =
    mode === "signup"
      ? "Free forever for your first conference. No credit card required."
      : "Log in to pick up where you left off.";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel glow-cyan relative w-full max-w-md rounded-3xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-white/[0.06] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
              <Gavel className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} />
            </span>
            <h2 id="signup-modal-title" className="mt-4 text-xl font-semibold text-foreground">
              {heading}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">{subheading}</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
              {mode === "signup" && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-foreground-muted">Full name</span>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                    <input
                      ref={firstFieldRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      autoComplete="name"
                      placeholder="Jordan Diaz"
                      className="w-full rounded-xl border border-panel-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
                    />
                  </div>
                </label>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground-muted">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                  <input
                    ref={mode === "login" ? firstFieldRef : undefined}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="you@school.edu"
                    className="w-full rounded-xl border border-panel-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground-muted">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-panel-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
                />
              </label>

              {error && (
                <p role="alert" className="text-xs text-accent-rose">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="glow-cyan glass-hover mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-5 py-3 text-sm font-medium text-[#05070d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "signup" ? "Creating account…" : "Logging in…"}
                  </>
                ) : (
                  <>
                    {mode === "signup" ? "Create account" : "Log in"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-foreground-muted">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("login")}
                    className="font-medium text-accent-cyan hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Need an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="font-medium text-accent-cyan hover:underline"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>

            {mode === "signup" && (
              <p className="mt-3 text-center text-[11px] text-foreground-muted">
                By creating an account you agree to our Terms and Privacy Policy.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

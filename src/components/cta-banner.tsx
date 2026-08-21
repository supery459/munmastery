"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gavel } from "lucide-react";
import { useSignUpModal } from "@/components/marketing/signup-modal-context";

export function CtaBanner() {
  const { openSignUp } = useSignUpModal();

  return (
    <section className="px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass-panel glow-gold relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-16"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(212, 175, 106, 0.16), transparent 60%)",
          }}
        />
        <Gavel className="mx-auto h-9 w-9 text-accent-gold" strokeWidth={1.5} />
        <h2 className="mx-auto mt-5 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to walk into your next committee session prepared?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-foreground-muted sm:text-base">
          Start training free — no credit card required. First Conference
          Mode gets first-timers ready in under an hour.
        </p>
        <button
          onClick={openSignUp}
          className="glass-hover group mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Start training free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    </section>
  );
}

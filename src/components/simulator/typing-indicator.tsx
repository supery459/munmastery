import { motion } from "framer-motion";
import type { Country } from "@/components/simulator/types";

export function TypingIndicator({ country }: { country: Country }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-foreground-muted">
        {country.code}
      </span>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-panel-border bg-panel px-4 py-3">
        <span className="text-xs text-foreground-muted">{country.name} is typing</span>
        <span className="flex items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-foreground-muted"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

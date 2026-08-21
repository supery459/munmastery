import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

/**
 * Standard "go back" control used on every sub-page header across the app.
 * Always carries a visible label (or an aria-label when the label is
 * responsively hidden) so it reads clearly for sighted and screen-reader
 * users alike — never an icon alone.
 */
export function BackLink({
  href,
  label,
  ariaLabel,
  icon: Icon = ArrowLeft,
  hideLabelOnMobile = false,
  className = "",
}: {
  href: string;
  label: string;
  /** Fuller accessible name, when the visible label is short (e.g. "Exit"). */
  ariaLabel?: string;
  icon?: LucideIcon;
  hideLabelOnMobile?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}
      className={`group flex shrink-0 items-center gap-1.5 rounded-lg border border-panel-border px-2.5 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-foreground ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      <span className={hideLabelOnMobile ? "hidden sm:inline" : ""}>{label}</span>
    </Link>
  );
}

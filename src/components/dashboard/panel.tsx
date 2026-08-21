import type { ReactNode } from "react";

type PanelProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Panel({ id, title, subtitle, action, className = "", children }: PanelProps) {
  return (
    <section id={id} className={`panel scroll-mt-20 rounded-2xl p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-foreground-muted">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

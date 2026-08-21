import { Gavel, Mail, MessageCircle, Rss } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: ["Speech coach", "Procedure trainer", "Resolution builder", "Committee simulation"],
  },
  {
    title: "For teams",
    links: ["Advisor dashboard", "Team onboarding", "Conference partners", "Success stories"],
  },
  {
    title: "Resources",
    links: ["First Conference Mode", "Blog", "Delegate handbook", "Help center"],
  },
];

export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-6 sm:px-6">
      <div className="glass mx-auto max-w-6xl rounded-3xl px-6 py-10 sm:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-5">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
                <Gavel className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold tracking-wide">
                MUN MASTERY
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-foreground-muted">
              AI-powered training for Model UN delegates — from first
              committee session to podium finish.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Mail, MessageCircle, Rss].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass-hover flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-foreground-muted transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border-glass pt-6 text-xs text-foreground-muted sm:flex-row">
          <span>© {new Date().getFullYear()} MUN Mastery. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

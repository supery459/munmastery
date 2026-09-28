import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppShell } from "@/components/common/app-shell";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "MUN Mastery — Train for Model UN with AI",
  description:
    "Practice speeches, master parliamentary procedure, and get instant AI feedback. MUN Mastery gets first-time delegates and veterans alike conference-ready.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background">
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}

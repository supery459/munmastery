import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { SignUpModalProvider } from "@/components/marketing/signup-modal-context";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <SignUpModalProvider>
      <AmbientBackground />
      {children}
    </SignUpModalProvider>
  );
}

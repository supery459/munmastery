"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCurrentUser, type UserProfile } from "@/lib/user-store";
import { CurrentUserProvider } from "@/lib/auth-context";
import { useClientValue } from "@/lib/use-client-value";

type GateState = UserProfile | null | "checking";

/**
 * Protects every /dashboard and sub-page route. There's no server session to
 * check, so this reads localStorage once on the client (via useClientValue,
 * so the server render and the first hydration pass agree on "checking"
 * before flipping to the real answer) and bounces anyone without a signed-in
 * account straight back to the landing page instead of ever rendering the
 * protected UI.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useClientValue<GateState>(getCurrentUser, "checking");

  useEffect(() => {
    if (user === null) router.replace("/");
  }, [user, router]);

  if (user === "checking" || user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
      </div>
    );
  }

  return <CurrentUserProvider user={user}>{children}</CurrentUserProvider>;
}

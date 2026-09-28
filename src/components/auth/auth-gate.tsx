"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCurrentUser, type UserProfile } from "@/lib/user-store";
import { CurrentUserProvider } from "@/lib/auth-context";

type GateState = UserProfile | null | "checking";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("mun-auth-change", callback);
  window.addEventListener("pageshow", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("mun-auth-change", callback);
    window.removeEventListener("pageshow", callback);
  };
}
function snapshot() { return JSON.stringify(getCurrentUser()); }

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
  const raw = useSyncExternalStore(subscribe, snapshot, () => '"checking"');
  const user = JSON.parse(raw) as GateState;

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

  return <CurrentUserProvider key={user.id} user={user}>{children}</CurrentUserProvider>;
}

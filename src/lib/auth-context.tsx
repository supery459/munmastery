"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UserProfile } from "@/lib/user-store";

const CurrentUserContext = createContext<UserProfile | null>(null);

export function CurrentUserProvider({ user, children }: { user: UserProfile; children: ReactNode }) {
  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
}

/** Only valid inside an <AuthGate> — every route that renders this has already confirmed a signed-in user. */
export function useCurrentUser(): UserProfile {
  const user = useContext(CurrentUserContext);
  if (!user) {
    throw new Error("useCurrentUser must be used within an AuthGate");
  }
  return user;
}

"use client";

/**
 * Multi-user account system backed by localStorage — there's no backend in
 * this app, so every account, its credentials, and its session all live in
 * the browser. Each account gets a unique id; per-account data elsewhere
 * (activity-store) is namespaced by that id so multiple people signing in on
 * the same browser never see each other's progress.
 */

export type UserProfile = {
  id: string;
  name: string;
  email: string;
};

type Account = UserProfile & {
  passwordHash: string;
  createdAt: number;
};

const ACCOUNTS_KEY = "mun-mastery:accounts:v1";
const SESSION_KEY = "mun-mastery:session:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Not a cryptographic hash — this is a client-only demo with no server to
 * keep a secret from, so there's no real threat model to harden against.
 * It just avoids storing passwords as plain text in localStorage.
 */
function hashPassword(password: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < password.length; i++) {
    hash ^= password.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

function readAccounts(): Account[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Account[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Private-browsing / storage-full — the account just won't persist.
  }
}

function setSession(userId: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SESSION_KEY, userId);
  } catch {
    // Ignore — the session just won't survive a reload.
  }
}

function toProfile(account: Account): UserProfile {
  return { id: account.id, name: account.name, email: account.email };
}

function newId(): string {
  if (isBrowser() && "randomUUID" in window.crypto) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export type AuthResult = { ok: true; profile: UserProfile } | { ok: false; error: string };

export function signUp({ name, email, password }: { name: string; email: string; password: string }): AuthResult {
  const trimmedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!trimmedName) return { ok: false, error: "Enter your name." };
  if (!normalizedEmail) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const accounts = readAccounts();
  if (accounts.some((a) => a.email === normalizedEmail)) {
    return { ok: false, error: "An account with that email already exists. Try logging in instead." };
  }

  const account: Account = {
    id: newId(),
    name: trimmedName,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  };
  writeAccounts([...accounts, account]);
  setSession(account.id);
  return { ok: true, profile: toProfile(account) };
}

export function logIn({ email, password }: { email: string; password: string }): AuthResult {
  const normalizedEmail = normalizeEmail(email);
  const accounts = readAccounts();
  const account = accounts.find((a) => a.email === normalizedEmail);

  if (!account || account.passwordHash !== hashPassword(password)) {
    return { ok: false, error: "Incorrect email or password." };
  }

  setSession(account.id);
  return { ok: true, profile: toProfile(account) };
}

export function logOut(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore.
  }
}

export function getCurrentUserId(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function getCurrentUser(): UserProfile | null {
  const id = getCurrentUserId();
  if (!id) return null;
  const account = readAccounts().find((a) => a.id === id);
  return account ? toProfile(account) : null;
}

export function updateName(userId: string, name: string): AuthResult {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Enter your name." };

  const accounts = readAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return { ok: false, error: "Account not found." };

  const updated: Account = { ...accounts[index], name: trimmed };
  accounts[index] = updated;
  writeAccounts(accounts);
  return { ok: true, profile: toProfile(updated) };
}

export function updateEmail(userId: string, email: string, currentPassword: string): AuthResult {
  const normalizedEmail = normalizeEmail(email);
  if (!EMAIL_PATTERN.test(normalizedEmail)) return { ok: false, error: "Enter a valid email address." };

  const accounts = readAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return { ok: false, error: "Account not found." };

  if (accounts[index].passwordHash !== hashPassword(currentPassword)) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (accounts.some((a) => a.id !== userId && a.email === normalizedEmail)) {
    return { ok: false, error: "Another account already uses that email." };
  }

  const updated: Account = { ...accounts[index], email: normalizedEmail };
  accounts[index] = updated;
  writeAccounts(accounts);
  return { ok: true, profile: toProfile(updated) };
}

export function updatePassword(userId: string, currentPassword: string, newPassword: string): AuthResult {
  const accounts = readAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) return { ok: false, error: "Account not found." };

  if (accounts[index].passwordHash !== hashPassword(currentPassword)) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (newPassword.length < 8) return { ok: false, error: "New password must be at least 8 characters." };

  const updated: Account = { ...accounts[index], passwordHash: hashPassword(newPassword) };
  accounts[index] = updated;
  writeAccounts(accounts);
  return { ok: true, profile: toProfile(updated) };
}

/** "Jordan Diaz" → "JD"; single name → first two letters; empty → "?". */
export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

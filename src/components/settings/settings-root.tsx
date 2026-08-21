"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, Check, KeyRound, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { BackLink } from "@/components/nav/back-link";
import { Panel } from "@/components/dashboard/panel";
import { useCurrentUser } from "@/lib/auth-context";
import { updateEmail, updateName, updatePassword } from "@/lib/user-store";
import { clearActivity } from "@/lib/activity-store";

function SettingsForm() {
  const user = useCurrentUser();

  // Local mirror of the account so this page reflects saves immediately —
  // the shared session context only re-reads localStorage on the next
  // AuthGate mount (e.g. navigating back into /dashboard).
  const [profile, setProfile] = useState(user);

  const [name, setName] = useState(user.name);
  const [nameStatus, setNameStatus] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const [email, setEmail] = useState(user.email);
  const [emailPassword, setEmailPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearStatus, setClearStatus] = useState<string | null>(null);

  function handleSaveName(e: FormEvent) {
    e.preventDefault();
    setNameStatus(null);
    const result = updateName(profile.id, name);
    if (!result.ok) {
      setNameError(result.error);
      return;
    }
    setNameError(null);
    setProfile(result.profile);
    setNameStatus("Display name updated.");
  }

  function handleSaveEmail(e: FormEvent) {
    e.preventDefault();
    setEmailStatus(null);
    const result = updateEmail(profile.id, email, emailPassword);
    if (!result.ok) {
      setEmailError(result.error);
      return;
    }
    setEmailError(null);
    setProfile(result.profile);
    setEmailPassword("");
    setEmailStatus("Email updated.");
  }

  function handleSavePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    const result = updatePassword(profile.id, currentPassword, newPassword);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }
    setPasswordError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("Password updated.");
  }

  function handleClearActivity() {
    clearActivity();
    setConfirmingClear(false);
    setClearStatus("Activity data cleared.");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-foreground-muted">Manage your account and local data.</p>
      </div>

      <Panel title="Display name" subtitle="Shown across your dashboard and sidebar.">
        <form onSubmit={handleSaveName} className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full flex-1 rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
          />
          <button
            type="submit"
            className="glass-hover shrink-0 rounded-xl border border-panel-border px-4 py-2.5 text-sm font-medium text-foreground"
          >
            Save
          </button>
        </form>
        {nameError && <p className="mt-2 text-xs text-accent-rose">{nameError}</p>}
        {nameStatus && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-accent-emerald">
            <Check className="h-3.5 w-3.5" />
            {nameStatus}
          </p>
        )}
      </Panel>

      <Panel title="Email address" subtitle="Confirm your current password to change it.">
        <form onSubmit={handleSaveEmail} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">New email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">Current password</span>
            <input
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="glass-hover self-start rounded-xl border border-panel-border px-4 py-2.5 text-sm font-medium text-foreground"
          >
            Save
          </button>
        </form>
        {emailError && <p className="mt-2 text-xs text-accent-rose">{emailError}</p>}
        {emailStatus && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-accent-emerald">
            <Check className="h-3.5 w-3.5" />
            {emailStatus}
          </p>
        )}
      </Panel>

      <Panel title="Password" subtitle="Choose a new password of at least 8 characters.">
        <form onSubmit={handleSavePassword} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">Current password</span>
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">New password</span>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">Confirm new password</span>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="glass-hover flex items-center gap-1.5 self-start rounded-xl border border-panel-border px-4 py-2.5 text-sm font-medium text-foreground"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Update password
          </button>
        </form>
        {passwordError && <p className="mt-2 text-xs text-accent-rose">{passwordError}</p>}
        {passwordStatus && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-accent-emerald">
            <Check className="h-3.5 w-3.5" />
            {passwordStatus}
          </p>
        )}
      </Panel>

      <Panel title="Danger zone" subtitle="This only affects this account's locally stored data.">
        <div className="rounded-xl border border-accent-rose/20 bg-accent-rose/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-rose" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Clear local activity data</div>
              <p className="mt-1 text-xs text-foreground-muted">
                Permanently deletes every logged simulation, speech check, and Learn module completion for this
                account. Your account and login stay intact.
              </p>

              {!confirmingClear ? (
                <button
                  onClick={() => {
                    setConfirmingClear(true);
                    setClearStatus(null);
                  }}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-accent-rose/30 px-3 py-1.5 text-xs font-medium text-accent-rose hover:bg-accent-rose/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear activity data
                </button>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-foreground">Are you sure? This can&apos;t be undone.</span>
                  <button
                    onClick={handleClearActivity}
                    className="rounded-lg bg-accent-rose px-3 py-1.5 text-xs font-medium text-[#05070d]"
                  >
                    Confirm clear
                  </button>
                  <button
                    onClick={() => setConfirmingClear(false)}
                    className="rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {clearStatus && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-accent-emerald">
                  <Check className="h-3.5 w-3.5" />
                  {clearStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function SettingsRoot() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
          <BackLink href="/dashboard" label="Dashboard" />
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
            <SettingsIcon className="h-4 w-4 text-accent-cyan" />
          </span>
          <div>
            <div className="text-sm font-medium text-foreground">Settings</div>
            <div className="text-xs text-foreground-muted">Account and data preferences</div>
          </div>
        </header>

        <SettingsForm />
      </div>
    </AuthGate>
  );
}

import type { Metadata } from "next";
import { SettingsRoot } from "@/components/settings/settings-root";

export const metadata: Metadata = {
  title: "Settings — MUN Mastery",
  description: "Manage your display name, email, password, and locally stored activity data.",
};

export default function SettingsPage() {
  return <SettingsRoot />;
}

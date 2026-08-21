"use client";

import { useRef, useState } from "react";
import { FileUp, Sparkles, X } from "lucide-react";
import { CountrySelect } from "@/components/common/country-select";
import type { GradeInput } from "@/components/position-paper/types";

const ACCEPTED_EXTENSIONS = [".txt", ".md"];
const MAX_FILE_BYTES = 300_000;

export function InputPanel({
  onGrade,
  initialCountry = "",
  initialTopic = "",
}: {
  onGrade: (input: GradeInput) => void;
  initialCountry?: string;
  initialTopic?: string;
}) {
  const [text, setText] = useState("");
  const [country, setCountry] = useState(initialCountry);
  const [topic, setTopic] = useState(initialTopic);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasAcceptedExtension) {
      setFileError("Only .txt and .md files can be uploaded — for Word or PDF drafts, paste the text instead.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError("That file is too large (max 300 KB of text).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setText(typeof reader.result === "string" ? reader.result : "");
      setFileName(file.name);
      setFileError(null);
    };
    reader.onerror = () => setFileError("Couldn't read that file — try pasting the text instead.");
    reader.readAsText(file);
  }

  function handleGrade() {
    onGrade({ text, country: country.trim(), topic: topic.trim() });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="panel rounded-2xl p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">Delegation / country (optional)</span>
            <CountrySelect value={country} onChange={setCountry} placeholder="e.g. France" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground-muted">Committee / topic (optional)</span>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              type="text"
              placeholder="e.g. Maritime security in the Indo-Pacific"
              className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
            />
          </label>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setFileName(null);
          }}
          placeholder="Paste your draft position paper here…"
          rows={14}
          className="mt-4 w-full resize-none rounded-xl border border-panel-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-foreground-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
            {wordCount} words
          </span>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="glass-hover flex items-center gap-1.5 rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <FileUp className="h-3.5 w-3.5" />
              Upload .txt / .md
            </button>
            {fileName && (
              <span className="flex items-center gap-1 rounded-full border border-panel-border px-2 py-1 text-[11px] text-foreground-muted">
                {fileName}
                <button
                  onClick={() => {
                    setFileName(null);
                    setText("");
                  }}
                  aria-label="Remove uploaded file"
                  className="hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {fileError && (
          <p role="alert" className="mt-2 text-xs text-accent-rose">
            {fileError}
          </p>
        )}

        <button
          onClick={handleGrade}
          disabled={wordCount === 0}
          className="glow-cyan glass-hover mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3 text-sm font-medium text-[#05070d] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Sparkles className="h-4 w-4" />
          Grade position paper
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

import type { AudienceSignal } from "@/lib/types";

type SignalUploaderProps = {
  onImport: (signals: AudienceSignal[]) => void;
  disabled?: boolean;
};

function createSignalId() {
  return `signal-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function parseSignals(
  content: string,
): AudienceSignal[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => {
    const separatorIndex = line.indexOf(",");

    if (separatorIndex > 0) {
      const source = line
        .slice(0, separatorIndex)
        .trim();

      const text = line
        .slice(separatorIndex + 1)
        .trim();

      if (source && text) {
        return {
          id: createSignalId(),
          source,
          text,
        };
      }
    }

    return {
      id: createSignalId(),
      source: "Imported",
      text: line,
    };
  });
}

export function SignalUploader({
  onImport,
  disabled = false,
}: SignalUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [isReading, setIsReading] =
    useState(false);

  async function handleFile(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setIsReading(true);

    try {
      const isTextFile =
        file.type === "text/plain" ||
        file.type === "text/csv" ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".csv");

      if (!isTextFile) {
        throw new Error(
          "Please upload a TXT or CSV file.",
        );
      }

      const content = await file.text();

      if (!content.trim()) {
        throw new Error(
          "The uploaded file is empty.",
        );
      }

      const signals = parseSignals(content);

      if (signals.length === 0) {
        throw new Error(
          "No valid audience signals were found.",
        );
      }

      onImport(signals);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to import signals.",
      );
    } finally {
      setIsReading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv,text/plain,text/csv"
        onChange={handleFile}
        disabled={disabled || isReading}
        className="hidden"
      />

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Import audience signals
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Upload a TXT or CSV file. Each line becomes
            one audience signal.
          </p>

          <p className="mt-2 text-xs text-zinc-400">
            CSV format: source, signal
          </p>

          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={openFilePicker}
              disabled={disabled || isReading}
            >
              {isReading
                ? "Importing..."
                : "Choose file"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
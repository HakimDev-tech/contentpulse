"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type SignalInputProps = {
  onAdd: (text: string, source: string) => void;
  disabled?: boolean;
};

export function SignalInput({
  onAdd,
  disabled = false,
}: SignalInputProps) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");

  const canSubmit =
    text.trim().length > 0 &&
    source.trim().length > 0 &&
    !disabled;

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onAdd(text.trim(), source.trim());

    setText("");
    setSource("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="signal-source"
          className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Source
        </label>

        <input
          id="signal-source"
          type="text"
          value={source}
          onChange={(event) =>
            setSource(event.target.value)
          }
          placeholder="Reddit, X, interview, support ticket..."
          disabled={disabled}
          className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      <div>
        <label
          htmlFor="signal-text"
          className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          Audience signal
        </label>

        <textarea
          id="signal-text"
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder="Paste what the audience actually said..."
          rows={5}
          disabled={disabled}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm leading-6 text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        />
      </div>

      <Button
        type="submit"
        disabled={!canSubmit}
      >
        Add signal
      </Button>
    </form>
  );
}
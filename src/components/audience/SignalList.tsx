"use client";

import type { AudienceSignal } from "@/lib/types";

type SignalListProps = {
  signals: AudienceSignal[];
  onRemove?: (signalId: string) => void;
};

export function SignalList({
  signals,
  onRemove,
}: SignalListProps) {
  if (signals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          No audience signals yet
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Add real audience statements to start the
          analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Audience signals
          </h3>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {signals.length} signal
            {signals.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {signals.map((signal, index) => (
          <article
            key={signal.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-zinc-400">
                    #{index + 1}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {signal.source}
                  </span>
                </div>

                <blockquote className="mt-3 border-l-2 border-zinc-300 pl-3 text-sm leading-6 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
                  “{signal.text}”
                </blockquote>
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={() =>
                    onRemove(signal.id)
                  }
                  className="shrink-0 text-xs font-medium text-zinc-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`Remove signal ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
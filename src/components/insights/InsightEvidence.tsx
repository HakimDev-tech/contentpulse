import type {
  AnalyzedSignal,
  AudienceSignal,
} from "@/lib/types";

type InsightEvidenceProps = {
  signals: AudienceSignal[];
  analyzedSignals: AnalyzedSignal[];
  signalIds: string[];
};

export function InsightEvidence({
  signals,
  analyzedSignals,
  signalIds,
}: InsightEvidenceProps) {
  const signalMap = new Map(
    signals.map((signal) => [
      signal.id,
      signal,
    ]),
  );

  const analyzedMap = new Map(
    analyzedSignals.map((signal) => [
      signal.signalId,
      signal,
    ]),
  );

  const evidence = signalIds
    .map((signalId) => {
      const signal = signalMap.get(signalId);

      if (!signal) {
        return null;
      }

      return {
        signal,
        analyzed: analyzedMap.get(signalId),
      };
    })
    .filter(
      (
        item,
      ): item is {
        signal: AudienceSignal;
        analyzed: AnalyzedSignal | undefined;
      } => item !== null,
    );

  if (evidence.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No supporting evidence is available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          Supporting evidence
        </h3>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Signals used to identify this audience insight.
        </p>
      </div>

      <div className="space-y-3">
        {evidence.map(({ signal, analyzed }) => (
          <article
            key={signal.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {signal.source}
              </span>

              {analyzed?.sentiment && (
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {analyzed.sentiment}
                </span>
              )}

              {analyzed && (
                <span className="text-xs text-zinc-400">
                  Pain {analyzed.painIntensity}/100
                </span>
              )}
            </div>

            <blockquote className="mt-3 border-l-2 border-zinc-300 pl-3 text-sm leading-6 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
              “{signal.text}”
            </blockquote>

            {analyzed && (
              <div className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-3 dark:border-zinc-800">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Problem
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    {analyzed.problem}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Intent
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    {analyzed.intent}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Topic
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    {analyzed.topic}
                  </p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
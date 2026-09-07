import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Score } from "@/components/ui/Score";

import type { AudienceInsight } from "@/lib/types";

type InsightCardProps = {
  insight: AudienceInsight;
  rank?: number;
};

export function InsightCard({
  insight,
  rank,
}: InsightCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {typeof rank === "number" && (
                <span className="text-xs font-medium text-zinc-400">
                  #{rank}
                </span>
              )}

              <Badge variant="info">
                {insight.signalIds.length} signal
                {insight.signalIds.length !== 1
                  ? "s"
                  : ""}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold leading-7 text-zinc-950 dark:text-white">
              {insight.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {insight.problem}
            </p>
          </div>

          <div className="shrink-0">
            <Score
              value={insight.painIntensity}
              label="Pain intensity"
              size="md"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Insight
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
            {insight.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Audience evidence
            </p>

            <p className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {insight.signalIds.length} supporting signal
              {insight.signalIds.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <Link
            href={`/workspace/opportunities?insightId=${encodeURIComponent(
              insight.id,
            )}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Find opportunities →
          </Link>
        </div>
      </div>
    </Card>
  );
}
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { OpportunityScore } from "@/components/opportunities/OpportunityScore";
import { ScoreBreakdown } from "@/components/opportunities/ScoreBreakdown";

import type { ContentOpportunity } from "@/lib/types";

type OpportunityCardProps = {
  opportunity: ContentOpportunity;
  rank?: number;
};

export function OpportunityCard({
  opportunity,
  rank,
}: OpportunityCardProps) {
  const isRecommended = rank === 1;

  return (
    <Card className="overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {typeof rank === "number" && (
                <span className="text-xs font-medium text-zinc-400">
                  #{rank}
                </span>
              )}

              {isRecommended && (
                <Badge variant="success">
                  Recommended
                </Badge>
              )}

              <Badge variant="info">
                {opportunity.signalIds.length} signal
                {opportunity.signalIds.length !== 1
                  ? "s"
                  : ""}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold leading-7 text-zinc-950 dark:text-white">
              {opportunity.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {opportunity.problem}
            </p>
          </div>

          <div className="shrink-0">
            <OpportunityScore
              score={opportunity.opportunityScore}
              confidence={opportunity.confidence}
            />
          </div>
        </div>

        {/* Angle */}
        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Suggested angle
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-800 dark:text-zinc-200">
            {opportunity.angle}
          </p>
        </div>

        {/* Breakdown */}
        <ScoreBreakdown
          demandScore={opportunity.demandScore}
          painScore={opportunity.painScore}
          relevanceScore={
            opportunity.relevanceScore
          }
          gapScore={opportunity.gapScore}
          actionabilityScore={
            opportunity.actionabilityScore
          }
        />

        {/* Action */}
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Based on {opportunity.signalIds.length} supporting
            signal
            {opportunity.signalIds.length !== 1
              ? "s"
              : ""}
          </p>

          <Link
            href={`/workspace/create?opportunityId=${encodeURIComponent(
              opportunity.id,
            )}`}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Create content →
          </Link>
        </div>
      </div>
    </Card>
  );
}
"use client";

import { useMemo } from "react";

import { InsightCard } from "@/components/insights/InsightCard";

import type { AudienceInsight } from "@/lib/types";

type InsightListProps = {
  insights: AudienceInsight[];
  limit?: number;
};

export function InsightList({
  insights,
  limit,
}: InsightListProps) {
  const rankedInsights = useMemo(() => {
    const sorted = [...insights].sort(
      (a, b) =>
        b.painIntensity -
        a.painIntensity,
    );

    return typeof limit === "number"
      ? sorted.slice(0, limit)
      : sorted;
  }, [insights, limit]);

  if (rankedInsights.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          No insights yet
        </h3>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Analyze audience signals to discover recurring
          problems and audience insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rankedInsights.map(
        (insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            rank={index + 1}
          />
        ),
      )}
    </div>
  );
}
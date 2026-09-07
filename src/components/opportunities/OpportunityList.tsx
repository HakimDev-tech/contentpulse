"use client";

import { useMemo } from "react";

import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

import type { ContentOpportunity } from "@/lib/types";

type OpportunityListProps = {
  opportunities: ContentOpportunity[];
  limit?: number;
};

export function OpportunityList({
  opportunities,
  limit,
}: OpportunityListProps) {
  const rankedOpportunities = useMemo(() => {
    const sorted = [...opportunities].sort(
      (a, b) =>
        b.opportunityScore -
        a.opportunityScore,
    );

    return typeof limit === "number"
      ? sorted.slice(0, limit)
      : sorted;
  }, [opportunities, limit]);

  if (rankedOpportunities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          No opportunities yet
        </h3>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Analyze audience signals to discover content
          opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rankedOpportunities.map(
        (opportunity, index) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            rank={index + 1}
          />
        ),
      )}
    </div>
  );
}
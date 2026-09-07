"use client";

import Link from "next/link";
import { useMemo } from "react";

import { loadAnalysis } from "@/lib/data/analysis-storage";
import { demoSignals } from "@/lib/data/demo-signals";

import type {
  AudienceInsight,
  ContentOpportunity,
} from "@/lib/types";

function InsightCard({
  insight,
  opportunities,
}: {
  insight: AudienceInsight;
  opportunities: ContentOpportunity[];
}) {
  const relatedOpportunities =
    opportunities.filter((opportunity) =>
      opportunity.signalIds.some((signalId) =>
        insight.signalIds.includes(signalId),
      ),
    );

  const evidence = demoSignals.filter((signal) =>
    insight.signalIds.includes(signal.id),
  );

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
              Audience insight
            </span>

            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {evidence.length} signals
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight">
            {insight.title}
          </h2>

          <p className="mt-3 text-sm font-medium text-zinc-700">
            {insight.problem}
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {insight.summary}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-zinc-200 px-5 py-4 lg:min-w-32 lg:text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Pain intensity
          </p>

          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {insight.painIntensity}
          </p>

          <p className="text-xs text-zinc-400">
            /100
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t border-zinc-100 pt-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold">
            Audience evidence
          </h3>

          <div className="space-y-3">
            {evidence.slice(0, 3).map((signal) => (
              <div
                key={signal.id}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <p className="text-sm leading-6 text-zinc-700">
                  “{signal.text}”
                </p>

                <p className="mt-2 text-xs text-zinc-400">
                  {signal.source}
                </p>
              </div>
            ))}

            {evidence.length > 3 && (
              <p className="text-xs text-zinc-400">
                +{evidence.length - 3} additional signals
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">
            Related opportunities
          </h3>

          {relatedOpportunities.length > 0 ? (
            <div className="space-y-3">
              {relatedOpportunities.slice(0, 3).map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-800">
                      {opportunity.title}
                    </p>

                    <span className="shrink-0 text-xs font-semibold text-zinc-500">
                      {opportunity.opportunityScore}/100
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {opportunity.angle}
                  </p>

                  <Link
                    href={`/workspace/create?opportunityId=${encodeURIComponent(
                      opportunity.id,
                    )}`}
                    className="mt-3 inline-flex text-xs font-medium text-zinc-950 hover:underline"
                  >
                    Create content →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-5">
              <p className="text-sm text-zinc-500">
                No content opportunity is directly associated with this
                insight.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function InsightsPage() {
  const analysis = useMemo(() => loadAnalysis(), []);

  const insights = analysis?.insights ?? [];
  const opportunities = analysis?.opportunities ?? [];

  const averagePain =
    insights.length > 0
      ? Math.round(
          insights.reduce(
            (total, insight) =>
              total + insight.painIntensity,
            0,
          ) / insights.length,
        )
      : 0;

  const strongestInsight =
    insights.length > 0
      ? [...insights].sort(
          (a, b) =>
            b.painIntensity -
            a.painIntensity,
        )[0]
      : null;

  if (!analysis) {
    return (
      <main className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
          <Link
            href="/workspace"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            ← Back to workspace
          </Link>

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-zinc-500">
                Audience intelligence
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                No analysis available yet.
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Run an audience analysis first. ContentPulse will extract
                recurring patterns from the audience signals and display the
                resulting insights here.
              </p>

              <Link
                href="/workspace"
                className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Run audience analysis
                <span
                  className="ml-2"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <header className="mb-8">
          <Link
            href="/workspace"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            ← Back to workspace
          </Link>

          <div className="mt-6">
            <p className="text-sm font-medium text-zinc-500">
              Audience intelligence
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Audience insights
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-600">
              Recurring audience patterns extracted from the evidence used by
              ContentPulse to identify content opportunities.
            </p>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Insights discovered
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {insights.length}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Recurring audience patterns
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Average pain
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {averagePain}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Average pain intensity /100
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Opportunities
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {opportunities.length}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Opportunities generated
            </p>
          </div>
        </section>

        {strongestInsight && (
          <section className="mb-8 rounded-2xl border border-zinc-950 bg-zinc-950 p-6 text-white shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Strongest pain signal
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {strongestInsight.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {strongestInsight.summary}
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-zinc-700 px-5 py-4 text-center">
                <p className="text-xs text-zinc-400">
                  Pain intensity
                </p>

                <p className="mt-1 text-3xl font-semibold">
                  {strongestInsight.painIntensity}
                </p>

                <p className="text-xs text-zinc-500">
                  /100
                </p>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="mb-5">
            <p className="text-sm font-medium text-zinc-500">
              Evidence analysis
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Recurring patterns
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Each insight is connected to the underlying audience signals and
              the opportunities they can generate.
            </p>
          </div>

          {insights.length > 0 ? (
            <div className="space-y-5">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  opportunities={opportunities}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <p className="font-medium">
                No insights found.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                The current analysis did not produce any recurring audience
                patterns.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
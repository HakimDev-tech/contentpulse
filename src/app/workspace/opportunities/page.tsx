"use client";

import Link from "next/link";
import { useState } from "react";

import {
  loadAnalysis,
  saveAnalysis,
  type StoredAnalysis,
} from "@/lib/data/analysis-storage";

import { demoSignals } from "@/lib/data/demo-signals";

function ScoreBadge({
  score,
}: {
  score: number;
}) {
  return (
    <div className="shrink-0 text-right">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
        Score
      </p>

      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {score}
      </p>

      <p className="text-xs text-zinc-400">
        /100
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <span>
      {label}{" "}
      <strong className="text-zinc-800">
        {value}
      </strong>
    </span>
  );
}

export default function OpportunitiesPage() {
  /*
   * Load the latest analysis directly when the state is initialized.
   *
   * This avoids calling setState() synchronously inside useEffect,
   * which React 19 / the current ESLint rules flag as a cascading render.
   */
  const [result, setResult] =
    useState<StoredAnalysis | null>(() => {
      return loadAnalysis();
    });

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function analyzeAudience() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signals: demoSignals,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "Audience analysis failed.",
        );
      }

      setResult(data.data);

      saveAnalysis(data.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  const opportunities = result
    ? [...result.opportunities].sort(
        (a, b) =>
          b.opportunityScore -
          a.opportunityScore,
      )
    : [];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Header */}
        <header className="mb-10">
          <p className="text-sm font-medium text-zinc-500">
            Opportunities
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Content opportunities
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-600">
                Ranked opportunities based on audience demand,
                pain, relevance, content gap, and actionability.
              </p>
            </div>

            <button
              type="button"
              onClick={analyzeAudience}
              disabled={loading}
              className="shrink-0 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Analyzing..."
                : result
                  ? "Refresh analysis"
                  : "Analyze audience"}
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <section className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-900">
              Analysis failed
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </section>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-zinc-500">
                Audience intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Find your next content opportunity
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                ContentPulse will analyze the audience signals,
                identify recurring problems, and rank the strongest
                evidence-backed opportunities.
              </p>

              <button
                type="button"
                onClick={analyzeAudience}
                className="mt-6 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Analyze audience
              </button>
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950"
                aria-hidden="true"
              />

              <div>
                <p className="font-medium">
                  Finding opportunities
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Analyzing audience evidence and ranking
                  opportunities...
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        {result && !loading && (
          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  {opportunities.length}{" "}
                  {opportunities.length === 1
                    ? "opportunity"
                    : "opportunities"}{" "}
                  found
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Highest potential first
                </h2>
              </div>

              <p className="text-xs text-zinc-400">
                Based on evidence from your audience
              </p>
            </div>

            {opportunities.length > 0 ? (
              <div className="space-y-4">
                {opportunities.map(
                  (opportunity, index) => (
                    <article
                      key={opportunity.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300"
                    >
                      <div className="flex gap-5">
                        {/* Ranking */}
                        <div className="hidden shrink-0 pt-1 text-sm font-semibold text-zinc-300 sm:block">
                          #{index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Main content */}
                          <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                            <div className="min-w-0">
                              {/* Badges */}
                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
                                  Evidence-backed
                                </span>

                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                                  {
                                    opportunity
                                      .signalIds
                                      .length
                                  }{" "}
                                  signals
                                </span>

                                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
                                  {
                                    opportunity.confidence
                                  }
                                  % confidence
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                                {opportunity.title}
                              </h3>

                              {/* Problem */}
                              <p className="mt-2 text-sm leading-6 text-zinc-600">
                                {opportunity.problem}
                              </p>

                              {/* Angle */}
                              <div className="mt-4 rounded-xl bg-zinc-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                  Content angle
                                </p>

                                <p className="mt-2 text-sm leading-6 text-zinc-700">
                                  {opportunity.angle}
                                </p>
                              </div>
                            </div>

                            {/* Score */}
                            <ScoreBadge
                              score={
                                opportunity.opportunityScore
                              }
                            />
                          </div>

                          {/* Score metrics */}
                          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
                            <Metric
                              label="Demand"
                              value={
                                opportunity.demandScore
                              }
                            />

                            <Metric
                              label="Pain"
                              value={
                                opportunity.painScore
                              }
                            />

                            <Metric
                              label="Relevance"
                              value={
                                opportunity.relevanceScore
                              }
                            />

                            <Metric
                              label="Gap"
                              value={
                                opportunity.gapScore
                              }
                            />

                            <Metric
                              label="Actionability"
                              value={
                                opportunity.actionabilityScore
                              }
                            />
                          </div>

                          {/* Actions */}
                          <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-zinc-400">
                              Opportunity score combines the
                              five dimensions above.
                            </p>

                            <Link
                              href={`/workspace/opportunities/${opportunity.id}`}
                              className="inline-flex w-fit items-center rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-950"
                            >
                              Explore evidence

                              <span className="ml-2">
                                →
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            ) : (
              <section className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
                <p className="font-medium">
                  No content opportunities found.
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  There was not enough recurring evidence to
                  produce meaningful opportunities.
                </p>
              </section>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
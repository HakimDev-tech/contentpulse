"use client";

import { useState } from "react";
import Link from "next/link";
import { saveAnalysis } from "@/lib/data/analysis-storage";
import { demoSignals } from "@/lib/data/demo-signals";

import type {
  AnalyzedSignal,
  AudienceInsight,
  ContentOpportunity,
} from "@/lib/types";

type AnalysisResult = {
  analyzedSignals: AnalyzedSignal[];
  insights: AudienceInsight[];
  opportunities: ContentOpportunity[];
};

function SignalCard({
  signal,
}: {
  signal: (typeof demoSignals)[number];
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="min-w-0">
        <p className="text-sm leading-6 text-zinc-700">
          “{signal.text}”
        </p>

        <div className="mt-3">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
            {signal.source}
          </span>
        </div>
      </div>
    </article>
  );
}

function InsightPreview({
  insight,
}: {
  insight: AudienceInsight;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold tracking-tight">
            {insight.title}
          </h3>

          <p className="mt-2 text-sm font-medium text-zinc-700">
            {insight.problem}
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {insight.summary}
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-zinc-100 px-3 py-2 text-center">
          <p className="text-xs text-zinc-400">
            Pain
          </p>

          <p className="text-lg font-semibold">
            {insight.painIntensity}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function AudiencePage() {
  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function analyzeAudience() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signals: demoSignals,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "Audience analysis failed.",
        );
      }

      const analysis =
        data.data as AnalysisResult;

      setResult(analysis);

      saveAnalysis(analysis);
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

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <header className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Step 1 — Analyze audience
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Understand what your audience needs.
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-600">
                ContentPulse analyzes audience signals
                to identify recurring problems, measure
                pain intensity, and uncover opportunities
                worth turning into content.
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
                  ? "Analyze Again"
                  : "Analyze Audience"}
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Signals
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {result
                ? result.analyzedSignals.length
                : demoSignals.length}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Audience inputs
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Insights
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {result?.insights.length ?? "—"}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Recurring patterns
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Opportunities
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {result?.opportunities.length ?? "—"}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Content opportunities
            </p>
          </div>
        </section>

        {error && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-900">
              Analysis failed
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={analyzeAudience}
              className="mt-4 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              Try again
            </button>
          </section>
        )}

        {loading && (
          <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950" />

              <div>
                <p className="font-medium">
                  Analyzing audience signals
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Extracting patterns and evaluating
                  pain intensity...
                </p>
              </div>
            </div>
          </section>
        )}

        {!result && !loading && (
          <section>
            <div className="mb-5">
              <p className="text-sm font-medium text-zinc-500">
                Input signals
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Audience evidence
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                These signals are the raw evidence
                ContentPulse uses to understand the
                audience.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {demoSignals.map((signal) => (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                />
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">
                    Ready to analyze?
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Run the analysis to transform
                    these raw signals into actionable
                    audience insights.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={analyzeAudience}
                  className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Run analysis →
                </button>
              </div>
            </div>
          </section>
        )}

        {result && !loading && (
          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  Analysis complete
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Audience patterns discovered
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  ContentPulse found these recurring
                  problems from the analyzed audience
                  evidence.
                </p>
              </div>

              <Link
                href="/workspace/insights"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:underline"
              >
                View all insights →
              </Link>
            </div>

            {result.insights.length > 0 ? (
              <div className="space-y-4">
                {result.insights.map((insight) => (
                  <InsightPreview
                    key={insight.id}
                    insight={insight}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
                <p className="font-medium">
                  No recurring patterns found.
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  The current signals did not contain
                  enough repeated evidence to generate
                  an audience insight.
                </p>
              </div>
            )}

            {result.opportunities.length > 0 && (
              <div className="mt-8 rounded-2xl border border-zinc-950 bg-zinc-950 p-6 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Next step
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {result.opportunities.length}{" "}
                      content opportunities identified.
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      Review the evidence and start with
                      the strongest opportunity.
                    </p>
                  </div>

                  <Link
                    href="/workspace"
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
                  >
                    Review opportunities →
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
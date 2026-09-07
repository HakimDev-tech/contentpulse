"use client";

import { useState } from "react";

import { AnalysisProgress } from "@/components/audience/AnalysisProgress";
import { OpportunityList } from "@/components/opportunities/OpportunityList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import { demoSignals } from "@/lib/data/demo-signals";
import { saveAnalysis } from "@/lib/data/analysis-storage";

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

type AnalyzeResponse = {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
};

function DemoSteps({
  activeStep,
}: {
  activeStep: number;
}) {
  const steps = [
    {
      number: "01",
      label: "Analyze",
    },
    {
      number: "02",
      label: "Review evidence",
    },
    {
      number: "03",
      label: "Create content",
    },
  ];

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-max items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive =
            stepNumber === activeStep;
          const isComplete =
            stepNumber < activeStep;

          return (
            <div
              key={step.number}
              className="flex items-center"
            >
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                    isActive || isComplete
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-200 bg-white text-zinc-400",
                  ].join(" ")}
                >
                  {isComplete
                    ? "✓"
                    : step.number}
                </div>

                <span
                  className={[
                    "text-sm font-medium",
                    isActive
                      ? "text-zinc-950"
                      : "text-zinc-400",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index <
                steps.length - 1 && (
                <div className="mx-4 h-px w-10 bg-zinc-200 sm:w-16" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function analyzeAudience() {
    setLoading(true);
    setError(null);

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

      const data =
        (await response.json()) as AnalyzeResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "Audience analysis failed.",
        );
      }

      if (!data.data) {
        throw new Error(
          "The analysis API returned no data.",
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

  const activeStep = result ? 2 : 1;

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Header */}
        <header className="mb-8">
          <DemoSteps
            activeStep={activeStep}
          />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Audience intelligence
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                What should I create next?
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-600">
                ContentPulse finds recurring
                audience problems and ranks
                the strongest evidence-backed
                content opportunities.
              </p>
            </div>

            <Button
              type="button"
              onClick={analyzeAudience}
              disabled={loading}
            >
              {loading
                ? "Analyzing audience..."
                : result
                  ? "Analyze Again"
                  : "Analyze Audience"}
            </Button>
          </div>
        </header>

        {/* Empty state */}
        {!result &&
          !loading &&
          !error && (
            <Card>
              <div className="max-w-xl">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />

                  <p className="text-sm font-medium text-zinc-500">
                    Demo ready
                  </p>
                </div>

                <h2 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
                  {demoSignals.length} audience
                  {" "}
                  {demoSignals.length === 1
                    ? "signal is"
                    : "signals are"}{" "}
                  ready.
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  ContentPulse will analyze
                  the signals, discover
                  recurring patterns, evaluate
                  opportunities, and rank them
                  using an explainable scoring
                  model.
                </p>

                <Button
                  type="button"
                  onClick={analyzeAudience}
                  className="mt-6"
                >
                  Run audience analysis
                  <span
                    className="ml-2"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Button>
              </div>
            </Card>
          )}

        {/* Loading */}
        {loading && (
          <Card>
            <div className="space-y-6">
              <AnalysisProgress
                currentStep={1}
                totalSteps={3}
                label="Analyzing audience signals"
              />

              <div className="flex items-center gap-4">
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950"
                  aria-hidden="true"
                />

                <div>
                  <p className="font-medium text-zinc-950 dark:text-white">
                    Analyzing audience
                  </p>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Extracting signals, finding
                    patterns, and ranking
                    content opportunities...
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card>
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="font-semibold text-red-900 dark:text-red-200">
                Analysis failed
              </p>

              <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">
                {error}
              </p>

              <Button
                type="button"
                variant="danger"
                onClick={analyzeAudience}
                className="mt-4"
              >
                Try again
              </Button>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && !loading && (
          <>
            {/* Analysis summary */}
            <section className="mb-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Signals analyzed
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
                    {result.analyzedSignals.length}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Audience inputs processed
                  </p>
                </Card>

                <Card>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Audience patterns
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
                    {result.insights.length}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Recurring problems discovered
                  </p>
                </Card>

                <Card>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Opportunities
                  </p>

                  <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
                    {result.opportunities.length}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Ranked by opportunity strength
                  </p>
                </Card>
              </div>
            </section>

            {/* Opportunities */}
            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Step 2 — Review evidence
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    Your strongest content
                    opportunities
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Start with the highest-ranked
                    opportunity, then inspect
                    the audience evidence before
                    creating content.
                  </p>
                </div>

                {result.opportunities.length >
                  0 && (
                  <span className="shrink-0 text-sm text-zinc-400">
                    {result.opportunities.length}{" "}
                    {result.opportunities.length ===
                    1
                      ? "opportunity"
                      : "opportunities"}{" "}
                    ranked
                  </span>
                )}
              </div>

              <OpportunityList
                opportunities={
                  result.opportunities
                }
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  loadAnalysis,
  type StoredAnalysis,
} from "@/lib/data/analysis-storage";

import { demoSignals } from "@/lib/data/demo-signals";

type GeneratedResult = {
  contentAtom: {
    opportunityId: string;
    coreProblem: string;
    coreInsight: string;
    audience: string;
    angle: string;
    keyEvidence: string[];
    promise: string;
    callToAction: string;
  };

  generatedContent: {
    platform: "linkedin" | "x" | "short_video";
    content: string;
  }[];
};

function ScoreRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-zinc-600">
          {label}
        </span>

        <span className="text-sm font-semibold text-zinc-900">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
          }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">
            Evidence Explorer
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Analysis not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Run an audience analysis first to explore
            evidence-backed opportunities.
          </p>

          <Link
            href="/workspace"
            className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Go to workspace
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();

  const [analysis] = useState<StoredAnalysis | null>(() => {
    return loadAnalysis();
  });

  const [generating, setGenerating] = useState(false);

  const [generationError, setGenerationError] =
    useState<string | null>(null);

  const [generatedResult, setGeneratedResult] =
    useState<GeneratedResult | null>(null);

  if (!analysis) {
    return <EmptyState />;
  }

  // Non-null alias.
  // TypeScript can safely track this value inside nested functions.
  const currentAnalysis = analysis;

  const opportunity = currentAnalysis.opportunities.find(
    (item) => item.id === params.id,
  );

  if (!opportunity) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">
              Evidence Explorer
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Opportunity not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              This opportunity is not available in the current
              analysis.
            </p>

            <Link
              href="/workspace/opportunities"
              className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Back to opportunities
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const evidence = demoSignals.filter((signal) =>
    opportunity.signalIds.includes(signal.id),
  );

  const insight = currentAnalysis.insights.find(
    (item) =>
      item.signalIds.some((signalId) =>
        opportunity.signalIds.includes(signalId),
      ),
  );

  async function createContent() {
    setGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunity,
          insight: insight ?? null,
          analyzedSignals: currentAnalysis.analyzedSignals,
        }),
      });

      let data: unknown;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response.",
        );
      }

      if (
        !response.ok ||
        typeof data !== "object" ||
        data === null ||
        !("success" in data) ||
        data.success !== true ||
        !("data" in data)
      ) {
        const errorMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Content generation failed.";

        throw new Error(errorMessage);
      }

      setGeneratedResult(
        data.data as GeneratedResult,
      );
    } catch (error) {
      console.error(
        "Content generation error:",
        error,
      );

      setGenerationError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Back navigation */}
        <Link
          href="/workspace/opportunities"
          className="inline-flex items-center text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <span className="mr-2">←</span>
          Back to opportunities
        </Link>

        {/* Header */}
        <header className="mt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
                  Evidence-backed opportunity
                </span>

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  {opportunity.signalIds.length} supporting signals
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {opportunity.title}
              </h1>

              <p className="mt-4 text-lg leading-8 text-zinc-600">
                {opportunity.problem}
              </p>
            </div>

            {/* Opportunity score */}
            <div className="shrink-0 rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm lg:w-48">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Opportunity score
              </p>

              <p className="mt-1 text-5xl font-semibold tracking-tight text-zinc-950">
                {opportunity.opportunityScore}
              </p>

              <p className="text-sm text-zinc-400">
                /100
              </p>

              <div className="mt-4 border-t border-zinc-100 pt-4">
                <p className="text-xs text-zinc-400">
                  Evidence confidence
                </p>

                <p className="mt-1 text-lg font-semibold text-zinc-900">
                  {opportunity.confidence}%
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Score + Angle */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Score breakdown */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Score breakdown
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Why this opportunity?
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                ContentPulse combines five dimensions into the
                final opportunity score.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              <ScoreRow
                label="Demand"
                value={opportunity.demandScore}
              />

              <ScoreRow
                label="Pain intensity"
                value={opportunity.painScore}
              />

              <ScoreRow
                label="Audience relevance"
                value={opportunity.relevanceScore}
              />

              <ScoreRow
                label="Content gap"
                value={opportunity.gapScore}
              />

              <ScoreRow
                label="Actionability"
                value={opportunity.actionabilityScore}
              />
            </div>
          </div>

          {/* Content angle */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">
              Recommended direction
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Content angle
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              The opportunity is translated into a concrete content
              direction before generation.
            </p>

            <div className="mt-6 rounded-xl bg-zinc-50 p-5">
              <p className="text-sm leading-7 text-zinc-800">
                {opportunity.angle}
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Evidence strength
              </p>

              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-sm text-zinc-600">
                  {evidence.length} signals support this opportunity.
                </p>

                <p className="text-lg font-semibold text-zinc-900">
                  {opportunity.confidence}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence Explorer */}
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Evidence Explorer
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Why does ContentPulse believe this?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Every opportunity is connected back to the original
                audience signals that created the pattern.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600">
              {evidence.length} signals
            </span>
          </div>

          {/* AI synthesis */}
          {insight && (
            <div className="mt-6 rounded-xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Audience synthesis
              </p>

              <p className="mt-2 text-sm leading-7 text-zinc-700">
                {insight.summary}
              </p>
            </div>
          )}

          {/* Signals */}
          {evidence.length > 0 ? (
            <div className="mt-6 space-y-4">
              {evidence.map((signal, index) => (
                <article
                  key={signal.id}
                  className="rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300"
                >
                  <div className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-7 text-zinc-800">
                        “{signal.text}”
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                        <span>
                          Source: {signal.source}
                        </span>

                        <span>
                          Signal: {signal.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-sm font-medium text-zinc-700">
                No supporting signals available.
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                This opportunity does not currently have accessible
                evidence in the demo dataset.
              </p>
            </div>
          )}
        </section>

        {/* Generation error */}
        {generationError && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-medium text-red-900">
              Content generation failed
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {generationError}
            </p>
          </section>
        )}

        {/* Generated content */}
        {generatedResult && (
          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Content Studio
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Generated from your audience evidence
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Every format below was generated from the same
                evidence-backed Content Atom.
              </p>
            </div>

            {/* Content Atom */}
            <div className="mt-6 rounded-xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Content Atom
              </p>

              <h3 className="mt-3 font-semibold text-zinc-900">
                {generatedResult.contentAtom.coreInsight}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {generatedResult.contentAtom.promise}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Audience
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-700">
                    {generatedResult.contentAtom.audience}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    CTA
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-700">
                    {generatedResult.contentAtom.callToAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence used */}
            {generatedResult.contentAtom.keyEvidence.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Evidence used
                </p>

                <div className="mt-3 space-y-2">
                  {generatedResult.contentAtom.keyEvidence.map(
                    (item, index) => (
                      <div
                        key={`${index}-${item}`}
                        className="rounded-lg border border-zinc-200 px-4 py-3 text-sm leading-6 text-zinc-700"
                      >
                        “{item}”
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Platform outputs */}
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {generatedResult.generatedContent.map(
                (item) => (
                  <article
                    key={item.platform}
                    className="rounded-xl border border-zinc-200 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold capitalize">
                        {item.platform ===
                        "short_video"
                          ? "Short video"
                          : item.platform}
                      </h3>

                      <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500">
                        AI generated
                      </span>
                    </div>

                    <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                      {item.content}
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>
        )}

        {/* Next step */}
        {!generatedResult && (
          <section className="mt-6 rounded-2xl bg-zinc-950 p-7 text-white shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Next step
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Turn this opportunity into content
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Use the opportunity, audience problem, content angle,
              and supporting evidence as the source of truth for
              platform-native content generation.
            </p>

            <button
              type="button"
              onClick={createContent}
              disabled={generating}
              className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Creating content..."
                : "Create content"}
            </button>
          </section>
        )}

        {/* Regenerate */}
        {generatedResult && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={createContent}
              disabled={generating}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Regenerating..."
                : "Regenerate content"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
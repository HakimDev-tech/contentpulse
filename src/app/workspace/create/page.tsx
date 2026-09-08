"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { loadAnalysis } from "@/lib/data/analysis-storage";
import { demoSignals } from "@/lib/data/demo-signals";

import type { ContentOpportunity } from "@/lib/types";

type Platform =
  | "linkedin"
  | "twitter"
  | "reddit"
  | "newsletter";

type GeneratedContent = {
  platform: Platform;
  content: string;
};

const platforms: {
  id: Platform;
  label: string;
  description: string;
}[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professional, insight-driven post",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    description: "Short-form thread or post",
  },
  {
    id: "reddit",
    label: "Reddit",
    description: "Native community discussion",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    description: "Long-form audience content",
  },
];

function getStoredOpportunity(
  opportunityId: string | null,
): ContentOpportunity | null {
  if (!opportunityId) {
    return null;
  }

  const analysis = loadAnalysis();

  if (!analysis?.opportunities) {
    return null;
  }

  return (
    analysis.opportunities.find(
      (opportunity) =>
        opportunity.id === opportunityId,
    ) ?? null
  );
}

function CreateContentPageContent() {
  const searchParams = useSearchParams();

  const opportunityId =
    searchParams.get("opportunityId");

  const opportunity = useMemo(
    () => getStoredOpportunity(opportunityId),
    [opportunityId],
  );

  const [platform, setPlatform] =
    useState<Platform>("linkedin");

  const [generated, setGenerated] =
    useState<GeneratedContent | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const evidence = opportunity
    ? demoSignals.filter((signal) =>
        opportunity.signalIds.includes(
          signal.id,
        ),
      )
    : [];

  async function generateContent() {
    if (!opportunity) {
      setError(
        "No content opportunity was selected.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setGenerated(null);

    try {
      const response = await fetch(
        "/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opportunity,
            platform,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "Content generation failed.",
        );
      }

      const content =
        typeof data.data === "string"
          ? data.data
          : data.data?.content ??
            data.content ??
            "";

      if (!content) {
        throw new Error(
          "The AI returned empty content.",
        );
      }

      setGenerated({
        platform,
        content,
      });
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

  if (!opportunity) {
    return (
      <main className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
          <Link
            href="/workspace"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
          >
            ← Back to opportunities
          </Link>

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-zinc-500">
                Step 3 — Create content
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                No opportunity selected
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Select an opportunity from the
                workspace before generating
                content.
              </p>

              <Link
                href="/workspace"
                className="mt-6 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Review opportunities

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
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
          >
            ← Back to opportunities
          </Link>

          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm font-medium text-zinc-500">
              Step 3 — Create content
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Turn the opportunity into
              content.
            </h1>

            <p className="max-w-2xl text-zinc-600">
              ContentPulse uses the selected
              audience problem, insight, and
              evidence to generate
              platform-specific content.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
                  Selected opportunity
                </span>

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  Score{" "}
                  {opportunity.opportunityScore}
                  /100
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight">
                {opportunity.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {opportunity.problem}
              </p>

              <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Content angle
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  {opportunity.angle}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Audience evidence
                  </h2>

                  <p className="mt-1 text-xs text-zinc-400">
                    Signals supporting this
                    opportunity
                  </p>
                </div>

                <span className="text-sm font-medium text-zinc-500">
                  {evidence.length}
                </span>
              </div>

              <div className="space-y-3">
                {evidence
                  .slice(0, 4)
                  .map((signal) => (
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

                {evidence.length === 0 && (
                  <p className="text-sm text-zinc-500">
                    No supporting signals
                    available.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Generate
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Choose a format
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                The same audience insight can be
                adapted to different content
                formats.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {platforms.map((item) => {
                const selected =
                  platform === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPlatform(item.id);
                      setGenerated(null);
                      setError(null);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {item.label}
                      </span>

                      {selected && (
                        <span
                          className="text-sm"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-2 text-xs leading-5 ${
                        selected
                          ? "text-zinc-300"
                          : "text-zinc-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={generateContent}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-zinc-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Generating content..."
                : "Generate content →"}
            </button>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-900">
                  Generation failed
                </p>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {error}
                </p>
              </div>
            )}

            {generated && (
              <div className="mt-6 border-t border-zinc-100 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Generated content
                    </p>

                    <h3 className="mt-1 font-semibold">
                      {platforms.find(
                        (item) =>
                          item.id ===
                          generated.platform,
                      )?.label ?? "Content"}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        generated.content,
                      )
                    }
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Copy
                  </button>
                </div>

                <div className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-700">
                  {generated.content}
                </div>

                <button
                  type="button"
                  onClick={generateContent}
                  disabled={loading}
                  className="mt-4 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                >
                  Regenerate
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function CreateContentFallback() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />

        <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-zinc-200" />

        <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-zinc-200" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />

          <div className="h-96 animate-pulse rounded-2xl bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}

export default function CreateContentPage() {
  return (
    <Suspense fallback={<CreateContentFallback />}>
      <CreateContentPageContent />
    </Suspense>
  );
}

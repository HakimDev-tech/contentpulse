"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import type {
  ContentAtom,
  ContentOpportunity,
  GeneratedContent,
} from "@/lib/types";

type ContentGenerationProps = {
  opportunity: ContentOpportunity;
  contentAtom: ContentAtom;
  onGenerated?: (content: GeneratedContent[]) => void;
};

const platforms = [
  {
    id: "linkedin",
    label: "LinkedIn",
  },
  {
    id: "x",
    label: "X",
  },
  {
    id: "short_video",
    label: "Short video",
  },
] as const;

export function ContentGeneration({
  opportunity,
  contentAtom,
  onGenerated,
}: ContentGenerationProps) {
  const [selectedPlatform, setSelectedPlatform] =
    useState<GeneratedContent["platform"]>("linkedin");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [generated, setGenerated] =
    useState<GeneratedContent | null>(null);

  async function generateContent() {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunity,
          contentAtom,
          platforms: [selectedPlatform],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate content.",
        );
      }

      const result = data?.data;

      let content: GeneratedContent | null = null;

      if (Array.isArray(result)) {
        content =
          result.find(
            (item: GeneratedContent) =>
              item.platform === selectedPlatform,
          ) ?? result[0] ?? null;
      } else if (
        result &&
        typeof result === "object" &&
        typeof result.content === "string"
      ) {
        content = result as GeneratedContent;
      }

      if (!content) {
        throw new Error(
          "The generation API returned an invalid result.",
        );
      }

      setGenerated(content);
      onGenerated?.([content]);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Failed to generate content.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Generate content
          </p>

          <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
            Turn this opportunity into publishable content
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Generate content directly from the validated
            opportunity and content atom.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Platform
          </p>

          <div className="grid gap-2 sm:grid-cols-3">
            {platforms.map((platform) => {
              const isSelected =
                selectedPlatform === platform.id;

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() =>
                    setSelectedPlatform(
                      platform.id,
                    )
                  }
                  className={[
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    isSelected
                      ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600",
                  ].join(" ")}
                >
                  {platform.label}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="button"
          onClick={generateContent}
          disabled={isGenerating}
          className="w-full sm:w-auto"
        >
          {isGenerating
            ? "Generating..."
            : "Generate content"}
        </Button>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {generated && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Generated content
              </p>

              <span className="text-xs font-medium capitalize text-zinc-500 dark:text-zinc-400">
                {generated.platform.replace(
                  "_",
                  " ",
                )}
              </span>
            </div>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
              {generated.content}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
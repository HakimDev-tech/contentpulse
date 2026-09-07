"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import type { GeneratedContent as GeneratedContentType } from "@/lib/types";

type GeneratedContentProps = {
  content: GeneratedContentType;
};

function getPlatformLabel(
  platform: GeneratedContentType["platform"],
) {
  switch (platform) {
    case "linkedin":
      return "LinkedIn";

    case "x":
      return "X";

    case "short_video":
      return "Short video";

    default:
      return platform;
  }
}

export function GeneratedContent({
  content,
}: GeneratedContentProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        content.content,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Generated content
            </p>

            <h3 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
              {getPlatformLabel(content.platform)}
            </h3>
          </div>

          <Badge variant="success">
            Ready
          </Badge>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
            {content.content}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Review the content before publishing.
          </p>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy content"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
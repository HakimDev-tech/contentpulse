"use client";

import type { GeneratedContent } from "@/lib/types";

type PlatformTabsProps = {
  activePlatform: GeneratedContent["platform"];
  onPlatformChange: (
    platform: GeneratedContent["platform"],
  ) => void;
  availablePlatforms?: GeneratedContent["platform"][];
};

const platformLabels: Record<
  GeneratedContent["platform"],
  string
> = {
  linkedin: "LinkedIn",
  x: "X",
  short_video: "Short video",
};

const defaultPlatforms: GeneratedContent["platform"][] =
  [
    "linkedin",
    "x",
    "short_video",
  ];

export function PlatformTabs({
  activePlatform,
  onPlatformChange,
  availablePlatforms = defaultPlatforms,
}: PlatformTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900"
      role="tablist"
      aria-label="Content platforms"
    >
      {availablePlatforms.map((platform) => {
        const isActive =
          platform === activePlatform;

        return (
          <button
            key={platform}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() =>
              onPlatformChange(platform)
            }
            className={[
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200",
            ].join(" ")}
          >
            {platformLabels[platform]}
          </button>
        );
      })}
    </div>
  );
}
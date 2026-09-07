"use client";

import { Progress } from "@/components/ui/Progress";

type AnalysisProgressProps = {
  currentStep: number;
  totalSteps?: number;
  label?: string;
};

const defaultSteps = [
  "Collecting signals",
  "Analyzing audience",
  "Clustering problems",
  "Building insights",
  "Scoring opportunities",
];

export function AnalysisProgress({
  currentStep,
  totalSteps = defaultSteps.length,
  label,
}: AnalysisProgressProps) {
  const safeCurrentStep = Math.min(
    Math.max(currentStep, 0),
    totalSteps,
  );

  const progress =
    totalSteps > 0
      ? Math.round(
          (safeCurrentStep / totalSteps) * 100,
        )
      : 0;

  const currentLabel =
    label ??
    defaultSteps[
      Math.min(
        Math.max(safeCurrentStep - 1, 0),
        defaultSteps.length - 1,
      )
    ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {currentLabel}
          </p>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Step {safeCurrentStep} of {totalSteps}
          </p>
        </div>

        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
          {progress}%
        </span>
      </div>

      <Progress
        value={progress}
        showValue={false}
      />
    </div>
  );
}
import { Progress } from "@/components/ui/Progress";

type ScoreBreakdownProps = {
  demandScore: number;
  painScore: number;
  relevanceScore: number;
  gapScore: number;
  actionabilityScore: number;
};

type ScoreItem = {
  label: string;
  value: number;
  description: string;
};

export function ScoreBreakdown({
  demandScore,
  painScore,
  relevanceScore,
  gapScore,
  actionabilityScore,
}: ScoreBreakdownProps) {
  const scores: ScoreItem[] = [
    {
      label: "Demand",
      value: demandScore,
      description:
        "How strongly the audience expresses this problem.",
    },
    {
      label: "Pain",
      value: painScore,
      description:
        "How significant or frustrating the problem appears.",
    },
    {
      label: "Relevance",
      value: relevanceScore,
      description:
        "How relevant the problem is to the target creator.",
    },
    {
      label: "Gap",
      value: gapScore,
      description:
        "How much useful content opportunity exists.",
    },
    {
      label: "Actionability",
      value: actionabilityScore,
      description:
        "How easily the problem can become useful content.",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          Score breakdown
        </h3>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Why this opportunity received its score.
        </p>
      </div>

      <div className="space-y-5">
        {scores.map((score) => (
          <div key={score.label}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {score.label}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {score.description}
                </p>
              </div>

              <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                {score.value}
              </span>
            </div>

            <Progress
              value={score.value}
              showValue={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
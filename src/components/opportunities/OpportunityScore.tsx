import { Score } from "@/components/ui/Score";

type OpportunityScoreProps = {
  score: number;
  confidence?: number;
};

export function OpportunityScore({
  score,
  confidence,
}: OpportunityScoreProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <Score
        value={score}
        label="Opportunity score"
        size="lg"
      />

      {typeof confidence === "number" && (
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Confidence
          </p>

          <p className="mt-1 text-2xl font-bold text-zinc-950 dark:text-white">
            {Math.round(confidence)}
            <span className="ml-1 text-sm font-medium text-zinc-400">
              / 100
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
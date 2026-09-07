type ScoreProps = {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
};

function getScoreLabel(value: number) {
  if (value >= 80) {
    return "Excellent";
  }

  if (value >= 60) {
    return "Strong";
  }

  if (value >= 40) {
    return "Moderate";
  }

  return "Low";
}

const sizes = {
  sm: {
    value: "text-xl",
    label: "text-xs",
  },
  md: {
    value: "text-3xl",
    label: "text-sm",
  },
  lg: {
    value: "text-5xl",
    label: "text-sm",
  },
};

export function Score({
  value,
  label,
  size = "md",
}: ScoreProps) {
  const normalizedValue = Math.min(
    100,
    Math.max(0, Math.round(value)),
  );

  return (
    <div>
      {label && (
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      )}

      <div className="flex items-baseline gap-2">
        <span
          className={[
            "font-bold tracking-tight text-zinc-950 dark:text-white",
            sizes[size].value,
          ].join(" ")}
        >
          {normalizedValue}
        </span>

        <span className="text-sm text-zinc-400">
          / 100
        </span>
      </div>

      <p
        className={[
          "mt-1 text-zinc-500 dark:text-zinc-400",
          sizes[size].label,
        ].join(" ")}
      >
        {getScoreLabel(normalizedValue)}
      </p>
    </div>
  );
}
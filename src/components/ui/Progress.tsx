type ProgressProps = {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
};

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
}: ProgressProps) {
  const percentage =
    max > 0
      ? Math.min(
          100,
          Math.max(0, (value / max) * 100),
        )
      : 0;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label && (
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </span>
          )}

          {showValue && (
            <span className="text-sm font-semibold text-zinc-950 dark:text-white">
              {Math.round(value)}
              {max === 100 ? "%" : ""}
            </span>
          )}
        </div>
      )}

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full bg-zinc-900 transition-all duration-500 dark:bg-white"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
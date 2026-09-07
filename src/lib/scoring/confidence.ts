export type ConfidenceInput = {
  signalCount: number;
  sourceCount: number;
  painIntensity: number;
  semanticConsistency: number;
};

export type ConfidenceResult = {
  score: number;
  level: "low" | "medium" | "high";
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Calculates the confidence that an audience problem
 * represents a real and sufficiently supported pattern.
 *
 * This is deliberately deterministic:
 * confidence is based on evidence quality, not on AI-generated claims.
 */
export function calculateConfidence(
  input: ConfidenceInput,
): ConfidenceResult {
  const signalCountScore = clamp(
    input.signalCount * 20,
  );

  const sourceCountScore = clamp(
    input.sourceCount * 30,
  );

  const painScore = clamp(input.painIntensity);

  const consistencyScore = clamp(
    input.semanticConsistency,
  );

  /*
   * Evidence distribution:
   * - 30% signal volume
   * - 25% source diversity
   * - 20% pain intensity
   * - 25% semantic consistency
   */
  const score = Math.round(
    signalCountScore * 0.3 +
      sourceCountScore * 0.25 +
      painScore * 0.2 +
      consistencyScore * 0.25,
  );

  const normalizedScore = clamp(score);

  let level: ConfidenceResult["level"];

  if (normalizedScore >= 75) {
    level = "high";
  } else if (normalizedScore >= 50) {
    level = "medium";
  } else {
    level = "low";
  }

  return {
    score: normalizedScore,
    level,
  };
}
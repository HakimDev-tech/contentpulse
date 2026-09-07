import type { AudienceInsight } from "@/lib/types";

export type InsightValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateInsight(
  insight: AudienceInsight,
): InsightValidationResult {
  const errors: string[] = [];

  if (!insight || typeof insight !== "object") {
    return {
      valid: false,
      errors: ["Insight must be an object."],
    };
  }

  if (
    typeof insight.id !== "string" ||
    insight.id.trim().length === 0
  ) {
    errors.push("Insight id is required.");
  }

  if (
    typeof insight.title !== "string" ||
    insight.title.trim().length === 0
  ) {
    errors.push("Insight title is required.");
  }

  if (
    typeof insight.problem !== "string" ||
    insight.problem.trim().length === 0
  ) {
    errors.push("Insight problem is required.");
  }

  if (
    typeof insight.summary !== "string" ||
    insight.summary.trim().length === 0
  ) {
    errors.push("Insight summary is required.");
  }

  if (!Array.isArray(insight.signalIds)) {
    errors.push("Insight signalIds must be an array.");
  } else if (insight.signalIds.length === 0) {
    errors.push(
      "Insight must reference at least one signal.",
    );
  } else {
    const invalidSignalId = insight.signalIds.some(
      (signalId) =>
        typeof signalId !== "string" ||
        signalId.trim().length === 0,
    );

    if (invalidSignalId) {
      errors.push(
        "All insight signalIds must be non-empty strings.",
      );
    }
  }

  if (
    typeof insight.painIntensity !== "number" ||
    !Number.isFinite(insight.painIntensity)
  ) {
    errors.push(
      "Insight painIntensity must be a valid number.",
    );
  } else if (
    insight.painIntensity < 0 ||
    insight.painIntensity > 100
  ) {
    errors.push(
      "Insight painIntensity must be between 0 and 100.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateInsights(
  insights: AudienceInsight[],
): InsightValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(insights)) {
    return {
      valid: false,
      errors: ["Insights must be an array."],
    };
  }

  if (insights.length === 0) {
    errors.push("At least one insight is required.");
  }

  insights.forEach((insight, index) => {
    const result = validateInsight(insight);

    result.errors.forEach((error) => {
      errors.push(`Insight ${index + 1}: ${error}`);
    });
  });

  const ids = insights
    .map((insight) => insight?.id)
    .filter(
      (id): id is string =>
        typeof id === "string" &&
        id.trim().length > 0,
    );

  if (new Set(ids).size !== ids.length) {
    errors.push("Insight ids must be unique.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
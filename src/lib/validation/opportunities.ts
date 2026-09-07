import type { ContentOpportunity } from "@/lib/types";

export type OpportunityValidationResult = {
  valid: boolean;
  errors: string[];
};

function validateScore(
  value: unknown,
  fieldName: string,
  errors: string[],
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    errors.push(
      `${fieldName} must be a valid number.`,
    );
    return;
  }

  if (value < 0 || value > 100) {
    errors.push(
      `${fieldName} must be between 0 and 100.`,
    );
  }
}

export function validateOpportunity(
  opportunity: ContentOpportunity,
): OpportunityValidationResult {
  const errors: string[] = [];

  if (
    !opportunity ||
    typeof opportunity !== "object"
  ) {
    return {
      valid: false,
      errors: ["Opportunity must be an object."],
    };
  }

  if (
    typeof opportunity.id !== "string" ||
    opportunity.id.trim().length === 0
  ) {
    errors.push("Opportunity id is required.");
  }

  if (
    typeof opportunity.title !== "string" ||
    opportunity.title.trim().length === 0
  ) {
    errors.push("Opportunity title is required.");
  }

  if (
    typeof opportunity.problem !== "string" ||
    opportunity.problem.trim().length === 0
  ) {
    errors.push("Opportunity problem is required.");
  }

  if (
    typeof opportunity.angle !== "string" ||
    opportunity.angle.trim().length === 0
  ) {
    errors.push("Opportunity angle is required.");
  }

  if (!Array.isArray(opportunity.signalIds)) {
    errors.push(
      "Opportunity signalIds must be an array.",
    );
  } else if (opportunity.signalIds.length === 0) {
    errors.push(
      "Opportunity must reference at least one signal.",
    );
  } else {
    const invalidSignalId =
      opportunity.signalIds.some(
        (signalId) =>
          typeof signalId !== "string" ||
          signalId.trim().length === 0,
      );

    if (invalidSignalId) {
      errors.push(
        "All opportunity signalIds must be non-empty strings.",
      );
    }
  }

  validateScore(
    opportunity.demandScore,
    "demandScore",
    errors,
  );

  validateScore(
    opportunity.painScore,
    "painScore",
    errors,
  );

  validateScore(
    opportunity.relevanceScore,
    "relevanceScore",
    errors,
  );

  validateScore(
    opportunity.gapScore,
    "gapScore",
    errors,
  );

  validateScore(
    opportunity.actionabilityScore,
    "actionabilityScore",
    errors,
  );

  validateScore(
    opportunity.opportunityScore,
    "opportunityScore",
    errors,
  );

  validateScore(
    opportunity.confidence,
    "confidence",
    errors,
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateOpportunities(
  opportunities: ContentOpportunity[],
): OpportunityValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(opportunities)) {
    return {
      valid: false,
      errors: ["Opportunities must be an array."],
    };
  }

  if (opportunities.length === 0) {
    errors.push(
      "At least one opportunity is required.",
    );
  }

  opportunities.forEach(
    (opportunity, index) => {
      const result =
        validateOpportunity(opportunity);

      result.errors.forEach((error) => {
        errors.push(
          `Opportunity ${index + 1}: ${error}`,
        );
      });
    },
  );

  const ids = opportunities
    .map((opportunity) => opportunity?.id)
    .filter(
      (id): id is string =>
        typeof id === "string" &&
        id.trim().length > 0,
    );

  if (new Set(ids).size !== ids.length) {
    errors.push(
      "Opportunity ids must be unique.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
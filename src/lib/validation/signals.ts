import type { AudienceSignal } from "@/lib/types";

export type SignalValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateSignal(
  signal: AudienceSignal,
): SignalValidationResult {
  const errors: string[] = [];

  if (!signal || typeof signal !== "object") {
    return {
      valid: false,
      errors: ["Signal must be an object."],
    };
  }

  if (
    typeof signal.id !== "string" ||
    signal.id.trim().length === 0
  ) {
    errors.push("Signal id is required.");
  }

  if (
    typeof signal.text !== "string" ||
    signal.text.trim().length === 0
  ) {
    errors.push("Signal text is required.");
  } else if (signal.text.trim().length < 10) {
    errors.push(
      "Signal text must contain at least 10 characters.",
    );
  }

  if (
    typeof signal.source !== "string" ||
    signal.source.trim().length === 0
  ) {
    errors.push("Signal source is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSignals(
  signals: AudienceSignal[],
): SignalValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(signals)) {
    return {
      valid: false,
      errors: ["Signals must be an array."],
    };
  }

  if (signals.length === 0) {
    errors.push("At least one signal is required.");
  }

  signals.forEach((signal, index) => {
    const result = validateSignal(signal);

    result.errors.forEach((error) => {
      errors.push(`Signal ${index + 1}: ${error}`);
    });
  });

  const ids = signals
    .map((signal) => signal?.id)
    .filter(
      (id): id is string =>
        typeof id === "string" &&
        id.trim().length > 0,
    );

  if (new Set(ids).size !== ids.length) {
    errors.push("Signal ids must be unique.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type { AudienceSignal, AnalyzedSignal } from "@/lib/types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not configured.");
}

const ai = new GoogleGenAI({
  apiKey,
});

export const analyzedSignalSchema = z.object({
  signalId: z.string().trim().min(1),
  problem: z.string().trim().min(1),
  intent: z.string().trim().min(1),
  topic: z.string().trim().min(1),
  painIntensity: z.number().min(0).max(100),
  sentiment: z.enum(["positive", "neutral", "negative"]),
});

export const analyzedSignalsSchema = z.array(analyzedSignalSchema);

const SYSTEM_PROMPT = `
You are the audience intelligence engine for ContentPulse.

Analyze each audience signal independently.

For each signal:

1. Identify the underlying problem.
2. Identify the user's intent.
3. Identify the main topic.
4. Estimate pain intensity from 0 to 100.
5. Classify sentiment.

Rules:

- Analyze every provided signal exactly once.
- Preserve the original signal ID exactly.
- Do not invent signal IDs.
- Do not omit signals.
- Do not duplicate signals.
- Do not invent information.
- Use only the provided signal.
- Preserve the original meaning.
- Do not generate content.
- Do not suggest solutions.
- Do not group signals.
- Return ONLY valid JSON.

For each signal provide:

- signalId
- problem
- intent
- topic
- painIntensity
- sentiment

painIntensity must be an integer from 0 to 100.
`;

export async function extractAudienceSignals(
  signals: AudienceSignal[],
): Promise<AnalyzedSignal[]> {
  if (signals.length === 0) {
    return [];
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}

Audience signals:

${JSON.stringify(signals, null, 2)}`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("Gemini returned an empty extraction response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("Invalid Gemini extraction response:", rawText);

    throw new Error("Gemini returned invalid extraction JSON.");
  }

  const validationResult = analyzedSignalsSchema.safeParse(parsed);

  if (!validationResult.success) {
    console.error(
      "Invalid extraction structure:",
      validationResult.error.flatten(),
    );

    throw new Error("Gemini returned an invalid extraction structure.");
  }

  const analyzedSignals = validationResult.data;

  const inputSignalIds = new Set(signals.map((signal) => signal.id));
  const outputSignalIds = new Set<string>();

  for (const signal of analyzedSignals) {
    if (!inputSignalIds.has(signal.signalId)) {
      throw new Error(
        `Unknown signal ID "${signal.signalId}" returned by Gemini.`,
      );
    }

    if (outputSignalIds.has(signal.signalId)) {
      throw new Error(
        `Duplicate signal ID "${signal.signalId}" returned by Gemini.`,
      );
    }

    outputSignalIds.add(signal.signalId);
  }

  if (analyzedSignals.length !== signals.length) {
    throw new Error(
      `Gemini analyzed ${analyzedSignals.length} signals, but ${signals.length} were provided.`,
    );
  }

  for (const signal of signals) {
    if (!outputSignalIds.has(signal.id)) {
      throw new Error(
        `Signal ID "${signal.id}" was not analyzed by Gemini.`,
      );
    }
  }

  return analyzedSignals;
}
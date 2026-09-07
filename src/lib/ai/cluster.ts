import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type { AnalyzedSignal, AudienceInsight } from "@/lib/types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not configured.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const audienceInsightSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  problem: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  signalIds: z.array(z.string().trim().min(1)).min(2),
  painIntensity: z.number().min(0).max(100),
});

const audienceInsightsSchema = z.array(audienceInsightSchema);

const SYSTEM_PROMPT = `
You are the semantic clustering engine for ContentPulse.

Your task is to discover recurring audience problems from analyzed audience signals.

Group signals together when they represent the same underlying problem, need, frustration, or intent.

Rules:

- Discover the groups yourself.
- Do not use predefined categories.
- Do not force unrelated signals together.
- A signal can belong to only one group.
- Prefer meaningful problem-based groups over superficial topic similarity.
- Ignore isolated noise when it does not represent a meaningful recurring pattern.
- Each meaningful group must contain at least 2 signals.
- Preserve the original signal IDs exactly.
- Do not generate content.
- Do not suggest solutions.
- Do not invent evidence.
- Return ONLY valid JSON.

For each group provide:

- id
- title
- problem
- summary
- signalIds
- painIntensity

painIntensity must be an integer from 0 to 100.
`;

export async function clusterAudienceSignals(
  signals: AnalyzedSignal[],
): Promise<AudienceInsight[]> {
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

Analyzed audience signals:

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
    throw new Error("Gemini returned an empty clustering response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("Invalid Gemini response:", rawText);

    throw new Error("Gemini returned invalid clustering JSON.");
  }

  const validationResult = audienceInsightsSchema.safeParse(parsed);

  if (!validationResult.success) {
    console.error(
      "Invalid clustering structure:",
      validationResult.error.flatten(),
    );

    throw new Error("Gemini returned an invalid clustering structure.");
  }

  const insights = validationResult.data;

  const validSignalIds = new Set(
    signals.map((signal) => signal.signalId),
  );

  const assignedSignalIds = new Set<string>();

  for (const insight of insights) {
    for (const signalId of insight.signalIds) {
      if (!validSignalIds.has(signalId)) {
        throw new Error(
          `Unknown signal ID "${signalId}" returned by Gemini.`,
        );
      }

      if (assignedSignalIds.has(signalId)) {
        throw new Error(
          `Signal ID "${signalId}" was assigned to multiple insights.`,
        );
      }

      assignedSignalIds.add(signalId);
    }
  }

  return insights;
}
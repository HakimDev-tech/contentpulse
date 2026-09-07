import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type {
  AnalyzedSignal,
  AudienceInsight,
  ContentOpportunity,
} from "@/lib/types";

import { buildOpportunity } from "@/lib/scoring/opportunity";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not configured.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const opportunityEvaluationSchema = z.object({
  demandScore: z.number().int().min(0).max(100),
  painScore: z.number().int().min(0).max(100),
  relevanceScore: z.number().int().min(0).max(100),
  gapScore: z.number().int().min(0).max(100),
  actionabilityScore: z.number().int().min(0).max(100),
  angle: z.string().trim().min(1),
});

const opportunityEvaluationsSchema = z.array(
  z.object({
    insightId: z.string().trim().min(1),
    evaluation: opportunityEvaluationSchema,
  }),
);

const SYSTEM_PROMPT = `
You are the opportunity evaluation engine for ContentPulse.

Your task is to evaluate audience insights and determine which problems
represent promising content opportunities.

You are NOT generating content.

You are evaluating the underlying audience problem.

For each audience insight, evaluate:

1. demandScore
   - How strongly and repeatedly the audience expresses this problem.
   - Consider the number and diversity of supporting signals.

2. painScore
   - How significant or frustrating the problem appears to be.

3. relevanceScore
   - How relevant the problem is to an AI automation creator/educator.

4. gapScore
   - How much opportunity exists to provide useful content around this
     problem based on the evidence provided.

5. actionabilityScore
   - How easily this problem can become a concrete, useful piece of content.

6. angle
   - A concise content angle that directly addresses the audience problem.
   - Do not write the actual content.
   - Do not promise virality.
   - Do not invent audience needs.

Rules:

- Use only the provided audience insights and analyzed signals.
- Do not invent evidence.
- Do not invent signal IDs.
- Do not generate content.
- Do not suggest unrelated topics.
- Scores must be integers from 0 to 100.
- Return exactly one evaluation for every provided insight.
- Preserve each insight ID exactly.
- Return ONLY valid JSON.

Output format:

[
  {
    "insightId": "original-insight-id",
    "evaluation": {
      "demandScore": 0,
      "painScore": 0,
      "relevanceScore": 0,
      "gapScore": 0,
      "actionabilityScore": 0,
      "angle": "..."
    }
  }
]
`;

export async function generateContentOpportunities(
  insights: AudienceInsight[],
  analyzedSignals: AnalyzedSignal[],
): Promise<ContentOpportunity[]> {
  if (insights.length === 0) {
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

Audience insights:

${JSON.stringify(insights, null, 2)}

Analyzed audience signals:

${JSON.stringify(analyzedSignals, null, 2)}`,
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
    throw new Error("Gemini returned an empty opportunity response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("Invalid Gemini opportunity response:", rawText);

    throw new Error("Gemini returned invalid opportunity JSON.");
  }

  const validationResult =
    opportunityEvaluationsSchema.safeParse(parsed);

  if (!validationResult.success) {
    console.error(
      "Invalid opportunity structure:",
      validationResult.error.flatten(),
    );

    throw new Error(
      "Gemini returned an invalid opportunity structure.",
    );
  }

  const evaluations = validationResult.data;

  const validInsightIds = new Set(
    insights.map((insight) => insight.id),
  );

  const processedInsightIds = new Set<string>();

  for (const item of evaluations) {
    if (!validInsightIds.has(item.insightId)) {
      throw new Error(
        `Unknown insight ID "${item.insightId}" returned by Gemini.`,
      );
    }

    if (processedInsightIds.has(item.insightId)) {
      throw new Error(
        `Duplicate insight ID "${item.insightId}" returned by Gemini.`,
      );
    }

    processedInsightIds.add(item.insightId);
  }

  if (evaluations.length !== insights.length) {
    throw new Error(
      `Gemini evaluated ${evaluations.length} insights, but ${insights.length} were provided.`,
    );
  }

  for (const insight of insights) {
    if (!processedInsightIds.has(insight.id)) {
      throw new Error(
        `Insight ID "${insight.id}" was not evaluated by Gemini.`,
      );
    }
  }

  const analyzedSignalMap = new Map(
    analyzedSignals.map((signal) => [
      signal.signalId,
      signal,
    ]),
  );

  return insights.map((insight) => {
    const item = evaluations.find(
      (evaluation) => evaluation.insightId === insight.id,
    );

    if (!item) {
      throw new Error(
        `No evaluation found for insight "${insight.id}".`,
      );
    }

    const sourceCount = new Set(
      insight.signalIds
        .map((signalId) => analyzedSignalMap.get(signalId))
        .filter(Boolean)
        .map((signal) => signal!.signalId),
    ).size;

    const semanticConsistency =
      insight.signalIds.length > 0
        ? Math.min(
            100,
            Math.round(
              (insight.painIntensity +
                item.evaluation.painScore) /
                2,
            ),
          )
        : 0;

    return buildOpportunity({
      id: `opportunity-${insight.id}`,
      title: insight.title,
      problem: insight.problem,
      angle: item.evaluation.angle,
      signalIds: insight.signalIds,
      demandScore: item.evaluation.demandScore,
      painScore: item.evaluation.painScore,
      relevanceScore: item.evaluation.relevanceScore,
      gapScore: item.evaluation.gapScore,
      actionabilityScore: item.evaluation.actionabilityScore,
      sourceCount,
      semanticConsistency,
    });
  });
}
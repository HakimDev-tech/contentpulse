import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type {
  AnalyzedSignal,
  AudienceInsight,
  ContentAtom,
  ContentOpportunity,
} from "@/lib/types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY environment variable is not configured.",
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const contentAtomSchema = z.object({
  opportunityId: z.string().trim().min(1),
  coreProblem: z.string().trim().min(1),
  coreInsight: z.string().trim().min(1),
  audience: z.string().trim().min(1),
  angle: z.string().trim().min(1),
  keyEvidence: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(10),
  promise: z.string().trim().min(1),
  callToAction: z.string().trim().min(1),
});

const SYSTEM_PROMPT = `
You are the Content Atom engine for ContentPulse.

Your task is to transform ONE evidence-backed content opportunity
into a structured Content Atom.

The Content Atom is the single source of truth used later to
generate platform-native content.

You are NOT writing the final content.

You are structuring the opportunity.

Required fields:

- opportunityId
- coreProblem
- coreInsight
- audience
- angle
- keyEvidence
- promise
- callToAction

Rules:

- Use only the provided opportunity, audience insight, and evidence.
- Do not invent audience needs.
- Do not invent evidence.
- Do not invent statistics.
- Do not claim that content will go viral.
- Preserve the underlying audience problem.
- Keep the core insight concise.
- The audience description must identify who has this problem.
- The angle must describe the content direction, not the final post.
- keyEvidence must contain evidence derived from the provided signals.
- promise must describe the useful outcome the content should provide.
- callToAction must be relevant to the problem.
- Do not write the final LinkedIn post.
- Do not write an X thread.
- Do not write a video script.
- Return ONLY valid JSON.
`;

export async function generateContentAtom(
  opportunity: ContentOpportunity,
  insight: AudienceInsight | undefined,
  analyzedSignals: AnalyzedSignal[],
): Promise<ContentAtom> {
  const supportingSignals = analyzedSignals.filter((signal) =>
    opportunity.signalIds.includes(signal.signalId),
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}

Content opportunity:

${JSON.stringify(opportunity, null, 2)}

Audience insight:

${JSON.stringify(insight ?? null, null, 2)}

Supporting audience signals:

${JSON.stringify(supportingSignals, null, 2)}`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error(
      "Gemini returned an empty Content Atom response.",
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error(
      "Invalid Gemini Content Atom response:",
      rawText,
    );

    throw new Error(
      "Gemini returned invalid Content Atom JSON.",
    );
  }

  const validationResult =
    contentAtomSchema.safeParse(parsed);

  if (!validationResult.success) {
    console.error(
      "Invalid Content Atom structure:",
      validationResult.error.flatten(),
    );

    throw new Error(
      "Gemini returned an invalid Content Atom structure.",
    );
  }

  const contentAtom = validationResult.data;

  if (
    contentAtom.opportunityId !==
    opportunity.id
  ) {
    throw new Error(
      `Content Atom references opportunity "${contentAtom.opportunityId}" instead of "${opportunity.id}".`,
    );
  }

  return contentAtom;
}
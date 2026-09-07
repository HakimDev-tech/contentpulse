import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type {
  ContentAtom,
  GeneratedContent,
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

const generatedContentSchema = z.object({
  linkedin: z.string().trim().min(1),
  x: z.string().trim().min(1),
  short_video: z.string().trim().min(1),
});

const SYSTEM_PROMPT = `
You are the platform-native content generation engine for ContentPulse.

You receive a Content Atom created from real audience evidence.

Your job is to transform the SAME Content Atom into three
platform-native content formats.

Generate:

1. LinkedIn post
2. X thread
3. Short video script

IMPORTANT:

The Content Atom is the source of truth.

Do not change the underlying audience problem.
Do not invent evidence.
Do not invent statistics.
Do not claim guaranteed virality.
Do not invent customer stories.
Do not introduce unrelated topics.

The three outputs should communicate the same core insight,
but each must be adapted to its platform.

LINKEDIN:

- Clear professional tone.
- Strong opening hook.
- Short paragraphs.
- Practical insight.
- Easy to scan.
- End with a relevant CTA.
- Avoid excessive hashtags.

X THREAD:

- Write a coherent thread.
- Each post should be short and readable.
- First post must establish the problem.
- Progress logically toward the insight.
- End with a useful takeaway or CTA.
- Separate posts using:

---POST 1---
---POST 2---
---POST 3---

and continue as needed.

SHORT VIDEO:

- Write a concise spoken script.
- Structure:
  Hook
  Problem
  Insight
  Practical takeaway
  CTA
- Keep it natural to speak.
- Do not include camera directions unless genuinely useful.

Return ONLY valid JSON:

{
  "linkedin": "...",
  "x": "...",
  "short_video": "..."
}
`;

export async function generatePlatformContent(
  contentAtom: ContentAtom,
): Promise<GeneratedContent[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}

Content Atom:

${JSON.stringify(contentAtom, null, 2)}`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error(
      "Gemini returned an empty content generation response.",
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error(
      "Invalid Gemini content response:",
      rawText,
    );

    throw new Error(
      "Gemini returned invalid content JSON.",
    );
  }

  const validationResult =
    generatedContentSchema.safeParse(parsed);

  if (!validationResult.success) {
    console.error(
      "Invalid generated content structure:",
      validationResult.error.flatten(),
    );

    throw new Error(
      "Gemini returned an invalid generated content structure.",
    );
  }

  const generated = validationResult.data;

  return [
    {
      platform: "linkedin",
      content: generated.linkedin,
    },
    {
      platform: "x",
      content: generated.x,
    },
    {
      platform: "short_video",
      content: generated.short_video,
    },
  ];
}
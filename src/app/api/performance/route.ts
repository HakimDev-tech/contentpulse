import { NextResponse } from "next/server";

import type {
  ContentAtom,
  ContentOpportunity,
  GeneratedContent,
} from "@/lib/types";

type PerformanceRequest = {
  content: GeneratedContent;
  opportunity?: ContentOpportunity;
  contentAtom?: ContentAtom;
};

type PerformanceResult = {
  overallScore: number;
  breakdown: {
    hook: number;
    relevance: number;
    clarity: number;
    actionability: number;
    callToAction: number;
  };
  strengths: string[];
  improvements: string[];
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function calculatePerformance(
  content: GeneratedContent,
  opportunity?: ContentOpportunity,
  contentAtom?: ContentAtom,
): PerformanceResult {
  const text = content.content.trim();

  if (!text) {
    return {
      overallScore: 0,
      breakdown: {
        hook: 0,
        relevance: 0,
        clarity: 0,
        actionability: 0,
        callToAction: 0,
      },
      strengths: [],
      improvements: ["The generated content is empty."],
    };
  }

  const normalizedText = text.toLowerCase();
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const words = text.split(/\s+/).filter(Boolean);

  /*
   * 1. Hook
   *
   * We look for a strong opening:
   * - question
   * - problem statement
   * - number
   * - contrast
   * - explicit audience pain
   */
  const firstSentence = sentences[0] ?? "";

  let hookScore = 45;

  if (firstSentence.includes("?")) {
    hookScore += 15;
  }

  if (/\d/.test(firstSentence)) {
    hookScore += 10;
  }

  if (
    /\b(problem|mistake|why|stop|before|after|instead|without|struggle|pain)\b/i.test(
      firstSentence,
    )
  ) {
    hookScore += 15;
  }

  if (firstSentence.length >= 30 && firstSentence.length <= 180) {
    hookScore += 10;
  }

  hookScore = clamp(hookScore);

  /*
   * 2. Relevance
   *
   * Compare the generated content with the opportunity
   * and/or content atom.
   */
  let relevanceScore = 50;

  const referenceTerms = [
    opportunity?.title,
    opportunity?.problem,
    opportunity?.angle,
    contentAtom?.coreProblem,
    contentAtom?.coreInsight,
    contentAtom?.angle,
    contentAtom?.audience,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (referenceTerms) {
    const referenceWords = new Set(
      referenceTerms
        .split(/\W+/)
        .filter((word) => word.length >= 4),
    );

    const contentWords = new Set(
      normalizedText
        .split(/\W+/)
        .filter((word) => word.length >= 4),
    );

    let matches = 0;

    for (const word of referenceWords) {
      if (contentWords.has(word)) {
        matches += 1;
      }
    }

    const overlap =
      referenceWords.size > 0
        ? matches / referenceWords.size
        : 0;

    relevanceScore += Math.round(overlap * 40);
  }

  relevanceScore = clamp(relevanceScore);

  /*
   * 3. Clarity
   *
   * Shorter sentences and reasonable content length
   * generally make the message easier to consume.
   */
  let clarityScore = 60;

  const averageSentenceLength =
    sentences.length > 0
      ? words.length / sentences.length
      : words.length;

  if (averageSentenceLength <= 18) {
    clarityScore += 20;
  } else if (averageSentenceLength <= 25) {
    clarityScore += 10;
  } else {
    clarityScore -= 10;
  }

  if (words.length >= 40 && words.length <= 500) {
    clarityScore += 10;
  }

  if (sentences.length >= 3) {
    clarityScore += 5;
  }

  clarityScore = clamp(clarityScore);

  /*
   * 4. Actionability
   *
   * Detect practical language, steps and concrete actions.
   */
  let actionabilityScore = 45;

  if (
    /\b(step|steps|how to|use|build|create|try|do|start|implement|automate|check|replace|instead)\b/i.test(
      text,
    )
  ) {
    actionabilityScore += 20;
  }

  if (/\b1[\).:-]|2[\).:-]|3[\).:-]/.test(text)) {
    actionabilityScore += 10;
  }

  if (contentAtom?.promise) {
    actionabilityScore += 10;
  }

  actionabilityScore = clamp(actionabilityScore);

  /*
   * 5. CTA
   */
  let callToActionScore = 35;

  if (
    /\b(comment|reply|share|follow|save|try|start|learn|download|check|send|tell me|let me know)\b/i.test(
      text,
    )
  ) {
    callToActionScore += 35;
  }

  if (contentAtom?.callToAction) {
    callToActionScore += 20;
  }

  callToActionScore = clamp(callToActionScore);

  const overallScore = Math.round(
    hookScore * 0.25 +
      relevanceScore * 0.25 +
      clarityScore * 0.2 +
      actionabilityScore * 0.2 +
      callToActionScore * 0.1,
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hookScore >= 75) {
    strengths.push("Strong opening hook.");
  } else {
    improvements.push(
      "Make the opening more specific, surprising, or problem-focused.",
    );
  }

  if (relevanceScore >= 75) {
    strengths.push(
      "The content stays closely aligned with the identified opportunity.",
    );
  } else {
    improvements.push(
      "Tie the content more directly to the audience problem and evidence.",
    );
  }

  if (clarityScore >= 75) {
    strengths.push("The structure is easy to scan and understand.");
  } else {
    improvements.push(
      "Use shorter sentences and a clearer structure.",
    );
  }

  if (actionabilityScore >= 75) {
    strengths.push(
      "The content gives the audience practical direction.",
    );
  } else {
    improvements.push(
      "Add concrete steps, examples, or an immediately usable takeaway.",
    );
  }

  if (callToActionScore >= 75) {
    strengths.push("The call to action is clear.");
  } else {
    improvements.push(
      "Finish with a more explicit and relevant call to action.",
    );
  }

  return {
    overallScore,
    breakdown: {
      hook: hookScore,
      relevance: relevanceScore,
      clarity: clarityScore,
      actionability: actionabilityScore,
      callToAction: callToActionScore,
    },
    strengths,
    improvements,
  };
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as Partial<PerformanceRequest>;

    if (!body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing generated content.",
        },
        { status: 400 },
      );
    }

    if (
      typeof body.content.content !== "string" ||
      body.content.content.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Generated content must contain a non-empty content field.",
        },
        { status: 400 },
      );
    }

    const result = calculatePerformance(
      body.content,
      body.opportunity,
      body.contentAtom,
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Performance evaluation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to evaluate content performance.",
      },
      { status: 500 },
    );
  }
}
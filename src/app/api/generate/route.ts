import { NextResponse } from "next/server";
import { z } from "zod";

import { generateContentAtom } from "@/lib/ai/content-atom";
import { generatePlatformContent } from "@/lib/ai/generate";

const requestSchema = z.object({
  opportunity: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    problem: z.string().min(1),
    angle: z.string().min(1),
    signalIds: z.array(z.string()).min(1),
    demandScore: z.number().min(0).max(100),
    painScore: z.number().min(0).max(100),
    relevanceScore: z.number().min(0).max(100),
    gapScore: z.number().min(0).max(100),
    actionabilityScore: z.number().min(0).max(100),
    opportunityScore: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
  }),

  insight: z
    .object({
      id: z.string(),
      title: z.string(),
      problem: z.string(),
      summary: z.string(),
      signalIds: z.array(z.string()),
      painIntensity: z.number().min(0).max(100),
    })
    .nullable()
    .optional(),

  analyzedSignals: z
    .array(
      z.object({
        signalId: z.string(),
        problem: z.string(),
        intent: z.string(),
        topic: z.string(),
        painIntensity: z.number().min(0).max(100),
        sentiment: z.enum([
          "positive",
          "neutral",
          "negative",
        ]),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body.",
        },
        { status: 400 },
      );
    }

    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid generation request.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      opportunity,
      insight,
      analyzedSignals,
    } = parsed.data;

    // Step 1: Build the Content Atom.
    const contentAtom =
      await generateContentAtom(
        opportunity,
        insight ?? undefined,
        analyzedSignals,
      );

    // Step 2: Generate platform-native content
    // from the Content Atom.
    const generatedContent =
      await generatePlatformContent(
        contentAtom,
      );

    return NextResponse.json(
      {
        success: true,
        data: {
          contentAtom,
          generatedContent,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Content generation error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Content generation failed.",
      },
      { status: 500 },
    );
  }
}
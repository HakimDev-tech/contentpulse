import { NextResponse } from "next/server";
import { z } from "zod";

import { extractAudienceSignals } from "@/lib/ai/extract";
import { clusterAudienceSignals } from "@/lib/ai/cluster";
import { generateContentOpportunities } from "@/lib/ai/opportunities";

const analyzeRequestSchema = z.object({
  signals: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        text: z.string().trim().min(1).max(5000),
        source: z.string().trim().min(1),
      }),
    )
    .min(1)
    .max(100),
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

    const parsed = analyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid audience signals.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { signals } = parsed.data;

    // Step 1: Extract structured audience signals
    const analyzedSignals = await extractAudienceSignals(signals);

    // Step 2: Discover recurring audience problems
    const insights = await clusterAudienceSignals(analyzedSignals);

    // Step 3: Evaluate and rank content opportunities
    const opportunities = await generateContentOpportunities(
      insights,
      analyzedSignals,
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          analyzedSignals,
          insights,
          opportunities,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Audience analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Audience analysis failed.",
      },
      { status: 500 },
    );
  }
}
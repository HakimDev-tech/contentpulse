import { NextResponse } from "next/server";

import { generateContentOpportunities } from "@/lib/ai/opportunities";

import type {
  AnalyzedSignal,
  AudienceInsight,
} from "@/lib/types";

type OpportunitiesRequest = {
  insights: AudienceInsight[];
  analyzedSignals: AnalyzedSignal[];
};

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as Partial<OpportunitiesRequest>;

    if (!Array.isArray(body.insights)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing insights.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.analyzedSignals)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing analyzedSignals.",
        },
        { status: 400 },
      );
    }

    const opportunities =
      await generateContentOpportunities(
        body.insights,
        body.analyzedSignals,
      );

    return NextResponse.json({
      success: true,
      data: opportunities,
    });
  } catch (error) {
    console.error(
      "Opportunity generation error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate content opportunities.",
      },
      { status: 500 },
    );
  }
}
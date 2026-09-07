import type {
  AnalyzedSignal,
  AudienceInsight,
  ContentOpportunity,
} from "@/lib/types";

const STORAGE_KEY = "contentpulse-analysis";

export type StoredAnalysis = {
  analyzedSignals: AnalyzedSignal[];
  insights: AudienceInsight[];
  opportunities: ContentOpportunity[];
};

export function saveAnalysis(analysis: StoredAnalysis): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(analysis),
    );
  } catch (error) {
    console.error("Failed to save ContentPulse analysis:", error);
  }
}

export function loadAnalysis(): StoredAnalysis | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredAnalysis;
  } catch (error) {
    console.error("Failed to load ContentPulse analysis:", error);

    return null;
  }
}

export function clearAnalysis(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
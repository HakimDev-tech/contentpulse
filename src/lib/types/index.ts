export type AudienceSignal = {
  id: string;
  text: string;
  source: string;
};

export type AnalyzedSignal = {
  signalId: string;
  problem: string;
  intent: string;
  topic: string;
  painIntensity: number;
  sentiment: "positive" | "neutral" | "negative";
};

export type AudienceInsight = {
  id: string;
  title: string;
  problem: string;
  summary: string;
  signalIds: string[];
  painIntensity: number;
};

export type ContentOpportunity = {
  id: string;
  title: string;
  problem: string;
  angle: string;
  signalIds: string[];

  demandScore: number;
  painScore: number;
  relevanceScore: number;
  gapScore: number;
  actionabilityScore: number;

  opportunityScore: number;
  confidence: number;
};

export type ContentAtom = {
  opportunityId: string;

  coreProblem: string;
  coreInsight: string;
  audience: string;
  angle: string;

  keyEvidence: string[];
  promise: string;
  callToAction: string;
};

export type GeneratedContent = {
  platform: "linkedin" | "x" | "short_video";
  content: string;
};

import type { ContentOpportunity } from "@/lib/types";

export function calculateOpportunityScore(
  demandScore: number,
  painScore: number,
  relevanceScore: number,
  gapScore: number,
  actionabilityScore: number,
): number {
  const score =
    demandScore * 0.3 +
    painScore * 0.2 +
    relevanceScore * 0.2 +
    gapScore * 0.15 +
    actionabilityScore * 0.15;

  return Math.round(score);
}

export function calculateConfidence(
  signalCount: number,
  sourceCount: number,
  semanticConsistency: number,
): number {
  const signalScore = Math.min(signalCount / 10, 1) * 40;
  const sourceScore = Math.min(sourceCount / 3, 1) * 30;
  const consistencyScore =
    Math.max(0, Math.min(semanticConsistency, 100)) * 0.3;

  return Math.round(
    signalScore + sourceScore + consistencyScore,
  );
}

export function buildOpportunity(
  data: Omit<
    ContentOpportunity,
    "opportunityScore" | "confidence"
  > & {
    sourceCount: number;
    semanticConsistency: number;
  },
): ContentOpportunity {
  const opportunityScore = calculateOpportunityScore(
    data.demandScore,
    data.painScore,
    data.relevanceScore,
    data.gapScore,
    data.actionabilityScore,
  );

  const confidence = calculateConfidence(
    data.signalIds.length,
    data.sourceCount,
    data.semanticConsistency,
  );

  return {
    id: data.id,
    title: data.title,
    problem: data.problem,
    angle: data.angle,
    signalIds: data.signalIds,
    demandScore: data.demandScore,
    painScore: data.painScore,
    relevanceScore: data.relevanceScore,
    gapScore: data.gapScore,
    actionabilityScore: data.actionabilityScore,
    opportunityScore,
    confidence,
  };
}
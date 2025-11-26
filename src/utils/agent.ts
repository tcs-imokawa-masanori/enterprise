import { EADefinition } from '../data/eaDatasets';

export interface AgentOutput {
  suggestedTargetApplications: string[];
  suggestedInitiatives: string[];
  suggestedRecommendations: string[];
}

// Simple rule-based agent to bootstrap content from current definition
export function generateFromDefinition(def: EADefinition): AgentOutput {
  const gaps = new Set<string>(def.gapAssessment.map((g) => g.toLowerCase()));

  const suggestions: AgentOutput = {
    suggestedTargetApplications: [],
    suggestedInitiatives: [],
    suggestedRecommendations: []
  };

  // Map gaps to initiatives and target apps
  for (const gap of gaps) {
    if (gap.includes('fragmented booking') || gap.includes('documentation')) {
      suggestions.suggestedTargetApplications.push('Integrated Liner Suite (booking→invoicing)');
      suggestions.suggestedInitiatives.push('Replace legacy booking & docs with integrated suite');
    }
    if (gap.includes('customer visibility')) {
      suggestions.suggestedTargetApplications.push('Customer Portal & Real-time Track/Trace');
      suggestions.suggestedInitiatives.push('Deliver self-service portal with event streaming');
    }
    if (gap.includes('manual compliance') || gap.includes('customs')) {
      suggestions.suggestedTargetApplications.push('Global Documentation & Compliance Platform');
      suggestions.suggestedInitiatives.push('Automate customs filings via standards (DCSA, UN/EDIFACT)');
    }
    if (gap.includes('disconnected analytics') || gap.includes('kpi')) {
      suggestions.suggestedTargetApplications.push('Enterprise Data Platform & Analytics');
      suggestions.suggestedInitiatives.push('Stand up lakehouse + BI for operational KPIs');
    }
    if (gap.includes('aging infrastructure') || gap.includes('fragile')) {
      suggestions.suggestedInitiatives.push('Hybrid cloud landing zone & observability');
      suggestions.suggestedRecommendations.push('Adopt API-first, event-driven integration and SRE');
    }
  }

  // De-duplicate
  suggestions.suggestedTargetApplications = Array.from(new Set(suggestions.suggestedTargetApplications));
  suggestions.suggestedInitiatives = Array.from(new Set(suggestions.suggestedInitiatives));
  suggestions.suggestedRecommendations = Array.from(new Set(suggestions.suggestedRecommendations));

  // If empty, provide generic seeds
  if (suggestions.suggestedTargetApplications.length === 0) {
    suggestions.suggestedTargetApplications.push('API Gateway', 'Customer Portal', 'Data Platform');
  }
  if (suggestions.suggestedInitiatives.length === 0) {
    suggestions.suggestedInitiatives.push('Define target operating model and product teams');
  }
  if (suggestions.suggestedRecommendations.length === 0) {
    suggestions.suggestedRecommendations.push('Zero trust security and DR automation');
  }

  return suggestions;
}



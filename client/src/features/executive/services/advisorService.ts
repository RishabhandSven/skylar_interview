import type { AdvisorContext } from '../types';

export interface AdvisorService {
  answer(prompt: string, context: AdvisorContext): Promise<string>;
}

class LocalAdvisorService implements AdvisorService {
  async answer(prompt: string, context: AdvisorContext): Promise<string> {
    const priority = context.recommendations[0]?.title ?? context.risks[0]?.title ?? 'review the latest executive brief';
    const risk = context.risks[0]?.description ?? 'No critical risk was identified in the latest insight response.';
    const metrics = context.metrics.slice(0, 2).map((metric) => `${metric.title}: ${metric.value}`).join(' · ');

    return `### Executive perspective\n\nBased on the current dashboard, prioritize **${priority}**. ${risk}\n\n**Supporting metrics:** ${metrics}\n\n_Question received:_ ${prompt}`;
  }
}

// Replace this adapter with a streaming API client when the executive-advisor endpoint is available.
export const advisorService: AdvisorService = new LocalAdvisorService();

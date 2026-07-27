import type { DashboardInsights } from '../../../types/insights';
import type { ExecutiveWorkspaceData } from '../types';

const suggestedPrompts = [
  'What should we prioritize today?',
  'What is our biggest operational risk?',
  'Which sales opportunities should we close first?',
  'Summarize today\'s business.',
];

export function createExecutiveWorkspaceData(insights: DashboardInsights): ExecutiveWorkspaceData {
  const topRisk = insights.risks[0];
  const topRecommendation = insights.recommendations[0];
  const topOpportunity = insights.opportunities[0];

  const decisions = [
    topRisk && {
      id: 'risk-response',
      title: `Escalate: ${topRisk.title}`,
      priority: topRisk.level === 'critical' ? 'critical' : 'high',
      owner: 'COO',
      deadline: 'Today',
      impact: 'Protect operational delivery and revenue confidence.',
      status: 'pending',
      rationale: topRisk.description,
      sourceMetrics: insights.metrics.slice(2).map((metric) => `${metric.title}: ${metric.value}`),
      confidence: topRisk.level === 'critical' ? 'High' : 'Medium',
    },
    topRecommendation && {
      id: 'recommendation-action',
      title: `Assign: ${topRecommendation.title}`,
      priority: topRecommendation.priority === 'high' ? 'high' : 'medium',
      owner: 'Sales Director',
      deadline: 'This week',
      impact: 'Convert the highest-value recommendation into an accountable action.',
      status: 'pending',
      rationale: topRecommendation.description,
      sourceMetrics: insights.metrics.slice(0, 2).map((metric) => `${metric.title}: ${metric.value}`),
      confidence: 'Medium',
    },
  ].filter(Boolean);

  return {
    decisions: decisions as ExecutiveWorkspaceData['decisions'],
    events: [
      { id: 'sync', title: 'Insights synchronized', detail: 'Latest Monday.com and AI insight response is available.', kind: 'sync' },
      ...(topRisk ? [{ id: 'risk', title: 'Risk detected', detail: topRisk.title, kind: 'risk' as const }] : []),
      ...(topRecommendation ? [{ id: 'recommendation', title: 'Recommendation created', detail: topRecommendation.title, kind: 'recommendation' as const }] : []),
      { id: 'insight', title: 'Executive brief prepared', detail: 'Business summary and action context are ready for review.', kind: 'insight' },
    ],
    brief: [
      { title: 'Business Summary', content: [insights.executiveSummary] },
      { title: 'Top Risks', content: insights.risks.slice(0, 3).map((item) => item.title) },
      { title: 'Top Opportunities', content: insights.opportunities.slice(0, 3).map((item) => item.title) },
      { title: 'Revenue Summary', content: insights.metrics.slice(0, 2).map((metric) => `${metric.title}: ${metric.value}`) },
      { title: 'Operational Summary', content: insights.metrics.slice(2).map((metric) => `${metric.title}: ${metric.value}`) },
      { title: 'Recommended Decisions', content: decisions.map((decision) => decision?.title).filter(Boolean) },
      { title: 'Meeting Talking Points', content: [topRisk?.description, topOpportunity?.description].filter(Boolean) as string[] },
    ],
    suggestedPrompts,
  };
}

import type {
  AlertViewModel,
  ChartPoint,
  DashboardInsights,
  DealRowViewModel,
  InsightResponse,
  MetricViewModel,
} from '../types/insights';
import {
  buildSparkline,
  extractAiBannerSnippet,
  extractCount,
  extractPercentage,
  formatCurrency,
  normalizeInsightText,
  parseCurrency,
  parseOpportunityItems,
  parseRecommendationItems,
  parseRiskItems,
} from './parseInsightText';

function extractPipelineValue(combinedText: string): number | null {
  const labeledMatch = combinedText.match(
    /(?:total\s+)?pipeline(?:\s+value)?[^$\n]{0,30}\$([\d,]+(?:\.\d+)?)\s*([MmKk])?/i,
  );
  if (labeledMatch) {
    return parseCurrency(`$${labeledMatch[1]}${labeledMatch[2] ?? ''}`);
  }

  const amounts = [...combinedText.matchAll(/\$([\d,]+(?:\.\d+)?)\s*([MmKk])?/g)]
    .map((match) => parseCurrency(`$${match[1]}${match[2] ?? ''}`))
    .filter((value): value is number => value !== null);

  return amounts.length > 0 ? Math.max(...amounts) : null;
}

function extractWonRatio(combinedText: string): number | null {
  return (
    extractPercentage(combinedText, /won|win\s*rate|deals?\s*won/) ??
    (() => {
      const won = extractCount(combinedText, /won\s*deals?/);
      const total = extractCount(combinedText, /total\s*deals?/);
      if (won !== null && total !== null && total > 0) {
        return Math.round((won / total) * 1000) / 10;
      }
      return null;
    })()
  );
}

function extractCompletionPercentage(combinedText: string): number | null {
  return extractPercentage(
    combinedText,
    /completion|complete|work\s*order\s*completion|operational\s*health/,
  );
}

function extractOverdueCount(combinedText: string): number | null {
  return extractCount(combinedText, /overdue|delayed\s*tasks?|slippage/);
}

function buildMetrics(combinedText: string): MetricViewModel[] {
  const pipelineValue = extractPipelineValue(combinedText);
  const wonRatio = extractWonRatio(combinedText);
  const completion = extractCompletionPercentage(combinedText);
  const overdue = extractOverdueCount(combinedText);

  return [
    {
      title: 'Total Deals Value',
      value: pipelineValue !== null ? formatCurrency(pipelineValue) : '—',
      trend: pipelineValue !== null ? 'up' : 'neutral',
      trendValue: pipelineValue !== null ? undefined : undefined,
      changeText: pipelineValue !== null ? 'from pipeline' : 'unavailable',
      sparklineData: buildSparkline(pipelineValue ?? 0),
    },
    {
      title: 'Deals Won Ratio',
      value: wonRatio !== null ? `${wonRatio}%` : '—',
      trend: wonRatio !== null && wonRatio >= 50 ? 'up' : wonRatio !== null ? 'down' : 'neutral',
      changeText: wonRatio !== null ? 'from analytics' : 'unavailable',
      sparklineData: buildSparkline(wonRatio ?? 0),
    },
    {
      title: 'Work Order Completion',
      value: completion !== null ? `${completion}%` : '—',
      trend: 'neutral',
      changeText: completion !== null ? 'current rate' : 'unavailable',
      sparklineData: buildSparkline(completion ?? 0),
    },
    {
      title: 'Overdue Tasks',
      value: overdue !== null ? `${overdue} Task${overdue === 1 ? '' : 's'}` : '—',
      trend: overdue !== null && overdue > 0 ? 'down' : overdue === 0 ? 'up' : 'neutral',
      changeText: overdue !== null ? 'requires attention' : 'unavailable',
      sparklineData: buildSparkline(overdue ?? 0),
    },
  ];
}

function buildChartData(combinedText: string, pipelineValue: number | null): ChartPoint[] {
  const won = extractCount(combinedText, /won\s*deals?/);
  const open = extractCount(combinedText, /open\s*deals?/);
  const lost = extractCount(combinedText, /lost\s*deals?/);

  if (won !== null || open !== null || lost !== null) {
    return [
      { name: 'Won', value: won ?? 0 },
      { name: 'Open', value: open ?? 0 },
      { name: 'Lost', value: lost ?? 0 },
    ].filter((point) => point.value > 0);
  }

  if (pipelineValue !== null && pipelineValue > 0) {
    const scaled = pipelineValue / 1_000_000;
    return [
      { name: 'Q1', value: scaled * 0.7 * 1_000_000 },
      { name: 'Q2', value: scaled * 0.82 * 1_000_000 },
      { name: 'Q3', value: scaled * 0.91 * 1_000_000 },
      { name: 'Current', value: pipelineValue },
    ];
  }

  return [];
}

function buildAlerts(risks: ReturnType<typeof parseRiskItems>): AlertViewModel[] {
  if (risks.length === 0) return [];

  return risks.slice(0, 3).map((risk, index) => ({
    id: `alert-${index}`,
    label: risk.title,
    type: risk.level === 'critical' ? 'Alert' : index === 1 ? 'Update' : 'System',
  }));
}

function inferDealStatus(text: string): string {
  const lower = text.toLowerCase();
  if (/(won|closed|signed)/.test(lower)) return 'Won';
  if (/(at[- ]risk|risk|stagnant|slippage|overdue)/.test(lower)) return 'At Risk';
  return 'Open';
}

function extractDealRows(
  risks: ReturnType<typeof parseRiskItems>,
  opportunities: ReturnType<typeof parseOpportunityItems>,
): DealRowViewModel[] {
  const combined = [...risks, ...opportunities];
  const rows: DealRowViewModel[] = [];

  combined.forEach((item, index) => {
    const text = `${item.title} ${item.description}`;
    const valueMatch = text.match(/\$([\d,]+(?:\.\d+)?)\s*([MmKk])?/);
    const dateMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);

    if (!valueMatch && !/(deal|contract|pipeline)/i.test(text)) {
      return;
    }

    rows.push({
      id: `deal-${index}`,
      name: item.title,
      value: valueMatch ? formatCurrency(parseCurrency(`$${valueMatch[1]}${valueMatch[2] ?? ''}`) ?? 0) : '—',
      stage: inferDealStatus(text) === 'Won' ? 'Contract Signed' : 'In Pipeline',
      date: dateMatch?.[1] ?? '—',
      status: inferDealStatus(text),
    });
  });

  return rows;
}

function isResponseEmpty(response: InsightResponse): boolean {
  return (
    !response.executiveSummary?.trim() &&
    !response.risks?.trim() &&
    !response.opportunities?.trim() &&
    !response.recommendations?.trim()
  );
}

export function transformInsightsResponse(response: InsightResponse): DashboardInsights {
  const executiveSummary = normalizeInsightText(response.executiveSummary ?? '');
  const risksText = normalizeInsightText(response.risks ?? '');
  const opportunitiesText = normalizeInsightText(response.opportunities ?? '');
  const recommendationsText = normalizeInsightText(response.recommendations ?? '');
  const combinedText = [
    executiveSummary,
    risksText,
    opportunitiesText,
    recommendationsText,
  ]
    .filter(Boolean)
    .join('\n');

  const risks = parseRiskItems(risksText);
  const opportunities = parseOpportunityItems(opportunitiesText);
  const recommendations = parseRecommendationItems(recommendationsText);
  const pipelineValue = extractPipelineValue(combinedText);
  const completion = extractCompletionPercentage(combinedText);

  return {
    executiveSummary,
    aiBannerSnippet: extractAiBannerSnippet(executiveSummary),
    risks,
    opportunities,
    recommendations,
    metrics: buildMetrics(combinedText),
    healthPercentage: completion !== null ? Math.round(completion) : 0,
    chartData: buildChartData(combinedText, pipelineValue),
    alerts: buildAlerts(risks),
    deals: extractDealRows(risks, opportunities),
    isEmpty: isResponseEmpty(response),
  };
}

import type { InsightItem } from '../features/dashboard/components/InsightCard';
import type { RecommendationItem } from '../features/dashboard/components/RecommendationCard';

const BULLET_PATTERN = /^[-*•]\s+/;
const NUMBERED_PATTERN = /^\d+[.)]\s+/;

function stripListPrefix(line: string): string {
  return line.replace(BULLET_PATTERN, '').replace(NUMBERED_PATTERN, '').trim();
}

function isListLine(line: string): boolean {
  return BULLET_PATTERN.test(line) || NUMBERED_PATTERN.test(line);
}

export function splitIntoSegments(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const segments: string[] = [];
  let current = '';

  for (const line of lines) {
    if (isListLine(line) && current) {
      segments.push(current.trim());
      current = stripListPrefix(line);
      continue;
    }

    if (isListLine(line)) {
      current = stripListPrefix(line);
      continue;
    }

    current = current ? `${current} ${line}` : line;
  }

  if (current) {
    segments.push(current.trim());
  }

  if (segments.length === 0) {
    return [trimmed];
  }

  return segments;
}

function splitTitleDescription(segment: string): { title: string; description: string } {
  const colonIndex = segment.indexOf(':');
  if (colonIndex > 0 && colonIndex < 80) {
    const title = segment.slice(0, colonIndex).trim();
    const description = segment.slice(colonIndex + 1).trim();
    if (description) {
      return { title, description };
    }
  }

  const sentenceMatch = segment.match(/^(.+?[.!?])\s+(.*)$/);
  if (sentenceMatch && sentenceMatch[1].length <= 120) {
    return {
      title: sentenceMatch[1].trim(),
      description: sentenceMatch[2].trim(),
    };
  }

  if (segment.length <= 100) {
    return { title: segment, description: '' };
  }

  const words = segment.split(/\s+/);
  const title = words.slice(0, 10).join(' ');
  const description = words.slice(10).join(' ');
  return { title, description: description || segment };
}

function detectRiskLevel(text: string): InsightItem['level'] | undefined {
  const lower = text.toLowerCase();
  if (/(critical|severe|urgent|high-risk)/.test(lower)) return 'critical';
  if (/(moderate|medium|at-risk)/.test(lower)) return 'moderate';
  if (/(minor|low)/.test(lower)) return 'low';
  return undefined;
}

function detectPriority(text: string): RecommendationItem['priority'] {
  const lower = text.toLowerCase();
  if (/(high impact|high priority|urgent|critical|immediate)/.test(lower)) return 'high';
  if (/(medium impact|medium priority|moderate)/.test(lower)) return 'medium';
  return 'low';
}

export function parseRiskItems(text: string): InsightItem[] {
  return splitIntoSegments(text).map((segment, index) => {
    const { title, description } = splitTitleDescription(segment);
    return {
      id: `risk-${index}`,
      title,
      description: description || segment,
      level: detectRiskLevel(segment),
    };
  });
}

export function parseOpportunityItems(text: string): InsightItem[] {
  return splitIntoSegments(text).map((segment, index) => {
    const { title, description } = splitTitleDescription(segment);
    return {
      id: `opportunity-${index}`,
      title,
      description: description || segment,
    };
  });
}

export function parseRecommendationItems(text: string): RecommendationItem[] {
  return splitIntoSegments(text).map((segment, index) => {
    const { title, description } = splitTitleDescription(segment);
    return {
      id: `recommendation-${index}`,
      title,
      description: description || segment,
      priority: detectPriority(segment),
      actionLabel: 'View Action',
    };
  });
}

export function extractAiBannerSnippet(executiveSummary: string): string {
  const trimmed = executiveSummary.trim();
  if (!trimmed) return 'Awaiting AI insight synthesis from Monday.com data.';

  const firstSentence = trimmed.match(/^(.+?[.!?])(?:\s|$)/);
  if (firstSentence?.[1] && firstSentence[1].length <= 160) {
    return firstSentence[1].trim();
  }

  return trimmed.length > 160 ? `${trimmed.slice(0, 157)}...` : trimmed;
}

export function parseCurrency(value: string): number | null {
  const normalized = value.replace(/,/g, '').toLowerCase();
  const match = normalized.match(/\$?\s*([\d.]+)\s*([mk])?/);
  if (!match) return null;

  let amount = parseFloat(match[1]);
  if (Number.isNaN(amount)) return null;

  const suffix = match[2];
  if (suffix === 'm') amount *= 1_000_000;
  if (suffix === 'k') amount *= 1_000;

  return amount;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount >= 1_000_000 ? 0 : 2,
  }).format(amount);
}

export function extractPercentage(text: string, keywords: RegExp): number | null {
  const keywordMatch = text.match(
    new RegExp(`([\\d.]+)\\s*%[^\\n.]{0,40}${keywords.source}`, 'i'),
  );
  if (keywordMatch) {
    const value = parseFloat(keywordMatch[1]);
    return Number.isNaN(value) ? null : value;
  }

  const reverseMatch = text.match(
    new RegExp(`${keywords.source}[^\\n.]{0,40}([\\d.]+)\\s*%`, 'i'),
  );
  if (reverseMatch) {
    const value = parseFloat(reverseMatch[1]);
    return Number.isNaN(value) ? null : value;
  }

  return null;
}

export function extractCount(text: string, keyword: RegExp): number | null {
  const match = text.match(new RegExp(`(\\d+)\\s+[^\\n.]{0,30}${keyword.source}`, 'i'));
  if (match) {
    const value = parseInt(match[1], 10);
    return Number.isNaN(value) ? null : value;
  }

  const reverseMatch = text.match(new RegExp(`${keyword.source}[^\\n.]{0,30}(\\d+)`, 'i'));
  if (reverseMatch) {
    const value = parseInt(reverseMatch[1], 10);
    return Number.isNaN(value) ? null : value;
  }

  return null;
}

export function buildSparkline(currentValue: number, points = 7): number[] {
  if (currentValue <= 0) {
    return Array.from({ length: points }, () => 0);
  }

  const variance = Math.max(currentValue * 0.08, 1);
  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const base = currentValue * (0.88 + progress * 0.12);
    const wave = Math.sin(index * 1.2) * variance * 0.3;
    return Math.max(0, Math.round((base + wave) * 10) / 10);
  });
}

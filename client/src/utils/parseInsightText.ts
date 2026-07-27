import type { InsightItem } from '../features/dashboard/components/InsightCard';
import type { RecommendationItem } from '../features/dashboard/components/RecommendationCard';

const BULLET_PATTERN = /^(?:[-*+]|\u2022)\s+/;
const NUMBERED_PATTERN = /^(\d+)[.)]\s+/;
const HEADING_PATTERN = /^#{1,6}\s+(.+)$/;
const HORIZONTAL_RULE_PATTERN = /^(?:-{3,}|_{3,}|\*{3,})$/;

function normalizeInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(`{1,3})(.*?)\1/g, '$2')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|\s)[*_](.+?)[*_](?=\s|$|[.,;:!?])/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

function getListItem(line: string): { text: string } | null {
  const numberedMatch = line.match(NUMBERED_PATTERN);
  if (numberedMatch) {
    return { text: `${numberedMatch[1]}. ${line.slice(numberedMatch[0].length)}` };
  }

  if (BULLET_PATTERN.test(line)) {
    return { text: line.replace(BULLET_PATTERN, '') };
  }

  return null;
}

export function normalizeInsightText(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !HORIZONTAL_RULE_PATTERN.test(line))
    .map((line) => {
      const headingMatch = line.match(HEADING_PATTERN);
      if (headingMatch) return normalizeInlineMarkdown(headingMatch[1]);

      const listItem = getListItem(line);
      if (listItem) return normalizeInlineMarkdown(listItem.text);

      return normalizeInlineMarkdown(line.replace(/^>\s?/, ''));
    })
    .filter(Boolean)
    .join('\n');
}

export function splitIntoSegments(text: string): string[] {
  const trimmed = normalizeInsightText(text);
  if (!trimmed) return [];

  const segments: string[] = [];
  let current = '';
  let pendingHeading = '';

  const lines = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !HORIZONTAL_RULE_PATTERN.test(line));

  for (const rawLine of lines) {
    const headingMatch = rawLine.match(HEADING_PATTERN);
    if (headingMatch) {
      if (current) {
        segments.push(current.trim());
        current = '';
      }
      pendingHeading = normalizeInlineMarkdown(headingMatch[1]);
      continue;
    }

    const listItem = getListItem(rawLine);
    if (listItem && current) {
      segments.push(current.trim());
      current = pendingHeading ? `${pendingHeading}: ${listItem.text}` : listItem.text;
      pendingHeading = '';
      continue;
    }

    if (listItem) {
      current = pendingHeading ? `${pendingHeading}: ${listItem.text}` : listItem.text;
      pendingHeading = '';
      continue;
    }

    const line = normalizeInlineMarkdown(rawLine.replace(/^>\s?/, ''));
    if (!line) continue;
    const textWithHeading = pendingHeading ? `${pendingHeading}: ${line}` : line;
    current = current ? `${current} ${textWithHeading}` : textWithHeading;
    pendingHeading = '';
  }

  if (current) segments.push(current.trim());
  if (pendingHeading) segments.push(pendingHeading);

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
  const trimmed = normalizeInsightText(executiveSummary).replace(/\n+/g, ' ').trim();
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

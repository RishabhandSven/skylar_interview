import type { DashboardInsights } from '../../types/insights';

export type DecisionPriority = 'critical' | 'high' | 'medium';
export type DecisionStatus = 'pending' | 'assigned' | 'resolved';

export interface ExecutiveDecision {
  id: string;
  title: string;
  priority: DecisionPriority;
  owner: string;
  deadline: string;
  impact: string;
  status: DecisionStatus;
  rationale: string;
  sourceMetrics: string[];
  confidence: string;
}

export interface ExecutiveEvent {
  id: string;
  title: string;
  detail: string;
  kind: 'insight' | 'risk' | 'recommendation' | 'sync';
}

export interface BriefSection {
  title: string;
  content: string[];
}

export interface AdvisorMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

export interface ExecutiveWorkspaceData {
  decisions: ExecutiveDecision[];
  events: ExecutiveEvent[];
  brief: BriefSection[];
  suggestedPrompts: string[];
}

export type AdvisorContext = Pick<
  DashboardInsights,
  'executiveSummary' | 'risks' | 'opportunities' | 'recommendations' | 'metrics'
>;

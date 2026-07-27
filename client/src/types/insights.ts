export interface InsightResponse {
  executiveSummary: string;
  risks: string;
  opportunities: string;
  recommendations: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
}

export interface ApiError extends Error {
  status: number;
  errorBody?: ApiErrorBody;
  isTimeout?: boolean;
}

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface InsightItemViewModel {
  id: string;
  title: string;
  description: string;
  level?: 'critical' | 'moderate' | 'low';
}

export interface RecommendationItemViewModel {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionUrl?: string;
}

export interface MetricViewModel {
  title: string;
  value: string;
  trend: TrendDirection;
  trendValue?: string;
  changeText?: string;
  sparklineData: number[];
}

export interface AlertViewModel {
  id: string;
  label: string;
  type: 'Alert' | 'Update' | 'System';
}

export interface DealRowViewModel {
  id: string;
  name: string;
  value: string;
  stage: string;
  date: string;
  status: string;
}

export interface ChartPoint {
  name: string;
  value: number;
}

export interface DashboardInsights {
  executiveSummary: string;
  aiBannerSnippet: string;
  risks: InsightItemViewModel[];
  opportunities: InsightItemViewModel[];
  recommendations: RecommendationItemViewModel[];
  metrics: MetricViewModel[];
  healthPercentage: number;
  chartData: ChartPoint[];
  alerts: AlertViewModel[];
  deals: DealRowViewModel[];
  isEmpty: boolean;
}

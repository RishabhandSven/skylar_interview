import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInsights } from '../services/api';
import type { ApiError, DashboardInsights } from '../types/insights';
import { transformInsightsResponse } from '../utils/deriveDashboardData';

export const INSIGHTS_QUERY_KEY = ['insights'] as const;

const STALE_TIME_MS = 5 * 60 * 1000;
const GC_TIME_MS = 10 * 60 * 1000;

function shouldRetry(failureCount: number, error: unknown): boolean {
  const apiError = error as ApiError;
  const status = apiError?.status ?? 0;

  if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
    return false;
  }

  if (status === 502 || status === 503 || status === 504 || status === 0) {
    return failureCount < 3;
  }

  return failureCount < 2;
}

export function useInsights() {
  const query = useQuery({
    queryKey: INSIGHTS_QUERY_KEY,
    queryFn: fetchInsights,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    retry: shouldRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
    refetchOnWindowFocus: false,
  });

  const parsed: DashboardInsights | null = useMemo(
    () => (query.data ? transformInsightsResponse(query.data) : null),
    [query.data],
  );

  return {
    ...query,
    parsed,
  };
}

import axios, { AxiosError, isAxiosError } from 'axios';
import type { ApiError, ApiErrorBody, InsightResponse } from '../types/insights';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const REQUEST_TIMEOUT_MS = 90_000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

function createApiError(message: string, status = 0): ApiError {
  const apiError = new Error(message) as ApiError;
  apiError.status = status;
  return apiError;
}

function isInsightResponse(data: unknown): data is InsightResponse {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const response = data as Record<string, unknown>;
  return (
    typeof response.executiveSummary === 'string' &&
    typeof response.risks === 'string' &&
    typeof response.opportunities === 'string' &&
    typeof response.recommendations === 'string'
  );
}

function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'status' in error) {
    return error as ApiError;
  }

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const apiError = new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Failed to fetch business insights',
    ) as ApiError;

    apiError.status = axiosError.response?.status ?? 0;
    apiError.errorBody = axiosError.response?.data;
    apiError.isTimeout =
      axiosError.code === 'ECONNABORTED' || axiosError.message.toLowerCase().includes('timeout');

    if (apiError.status === 502) {
      apiError.message =
        apiError.errorBody?.message ??
        'Bad Gateway — a downstream service (Monday.com or Gemini) is unavailable.';
    }

    return apiError;
  }

  return createApiError(
    error instanceof Error ? error.message : 'An unexpected error occurred while fetching insights',
  );
}

export async function fetchInsights(): Promise<InsightResponse> {
  try {
    const { data } = await apiClient.get<InsightResponse>('/api/insights');
    if (!isInsightResponse(data)) {
      throw createApiError('The API returned an invalid insights response.', 422);
    }

    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as ApiError).message);
  }
  return 'An unexpected error occurred while fetching insights';
}

export function getErrorTitle(error: unknown): string {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return 'Failed to load business intelligence data';
  }

  const apiError = error as ApiError;

  if (apiError.isTimeout) {
    return 'Request timed out';
  }

  switch (apiError.status) {
    case 502:
      return 'Bad Gateway — downstream service unavailable';
    case 500:
      return 'Server error generating insights';
    case 422:
      return 'Invalid API response';
    case 0:
      return 'Unable to reach the API server';
    default:
      return 'Failed to load business intelligence data';
  }
}

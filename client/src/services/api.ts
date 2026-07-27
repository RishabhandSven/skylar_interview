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

function toApiError(error: unknown): ApiError {
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

  const fallback = new Error('An unexpected error occurred while fetching insights') as ApiError;
  fallback.status = 0;
  return fallback;
}

export async function fetchInsights(): Promise<InsightResponse> {
  try {
    const { data } = await apiClient.get<InsightResponse>('/api/insights');
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
    case 0:
      return 'Unable to reach the API server';
    default:
      return 'Failed to load business intelligence data';
  }
}

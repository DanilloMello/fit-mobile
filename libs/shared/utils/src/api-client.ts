import axios from 'axios';

// process.env is inlined by Metro at build time; declare type for tsc
declare const process: { env: Record<string, string | undefined> };

const API_URL =
  process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor - will be configured in identity module
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

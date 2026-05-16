export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:8000";

export const API_STALE_TIME = 5 * 60 * 1000;
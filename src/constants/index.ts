/**
 * API Constants
 */
export const API = {
  BASE_URL: "https://dytext.scalix.in",
  ENDPOINTS: {
    GET_MODEL: "/api/get-model",
  },
  HEADERS: {
    CLIENT_TOKEN: "x-dytext-client-token",
    CONTENT_TYPE: "application/json",
  },
} as const;

/**
 * Default timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  CACHE_TTL: 300000, // 5 minutes
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Default limits and counts
 */
export const DEFAULTS = {
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Build full API URL
 */
export function buildApiUrl(endpoint: string): string {
  return `${API.BASE_URL}${endpoint}`;
}

/**
 * Error codes enum
 */
export enum DytextErrorCode {
  INITIALIZATION_ERROR = "INITIALIZATION_ERROR",
  INVALID_TOKEN = "INVALID_TOKEN",
  API_ERROR = "API_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  CACHE_ERROR = "CACHE_ERROR",
  RESOLUTION_ERROR = "RESOLUTION_ERROR",
}

/**
 * Base error structure
 */
export interface DytextError {
  code: DytextErrorCode;
  message: string;
  details?: unknown;
}

/**
 * API response structure
 */
export interface DytextApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: DytextError;
}

/**
 * Resolution result with metadata
 */
export interface DytextResolutionResult<T = unknown> {
  value: T;
  path: string;
  timestamp: number;
  source: "cache" | "api";
  metadata?: Record<string, unknown>;
}

/**
 * Model data type for resolution
 */
export type ModelData = Record<string, unknown>;

/**
 * Resolved value type
 */
export type ResolvedValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ModelData
  | Array<unknown>;

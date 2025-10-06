import { DytextApiConfig } from '../types/config';

/**
 * Default API configuration values
 */
export const DEFAULT_API_CONFIG: Required<DytextApiConfig> = {
  endpoint: 'https://dytext.scalix.in/api/get-model',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Request interceptor interface
 */
export interface RequestInterceptor {
  onRequest?: (url: string, init: RequestInit) => Promise<RequestInit>;
  onResponse?: (response: Response) => Promise<Response>;
  onError?: (error: Error) => Promise<never>;
}
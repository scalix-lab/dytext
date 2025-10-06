import { DytextApiConfig } from '../types/config';
import { ApiError, NetworkError } from '../errors/errors';
import { ensureInitialized, getState } from '../state/state';
import { API, TIMEOUTS, DEFAULTS } from '../constants';

export class DytextApiClient {
  private readonly config: Required<DytextApiConfig>;

  constructor(config: DytextApiConfig = {}) {
    this.config = {
      endpoint: `${API.BASE_URL}${API.ENDPOINTS.GET_MODEL}`,
      timeout: TIMEOUTS.API_REQUEST,
      retryAttempts: DEFAULTS.RETRY_ATTEMPTS,
      retryDelay: TIMEOUTS.RETRY_DELAY,
      ...config
    };
  }

  /**
   * Make an HTTP request with retries
   */
  private async request<T>(
    url: string,
    init: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          'content-type': API.HEADERS.CONTENT_TYPE,
          ...init.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return undefined as T;
        }

        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          await response.json().catch(() => undefined)
        );
      }

      const result = await response.json();
      
      // If the response has a data property, return that
      if (result && typeof result === 'object' && 'data' in result) {
        return result.data;
      }
      
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }

      // Retry on network errors
      if (attempt < this.config.retryAttempts) {
        await new Promise(resolve =>
          setTimeout(resolve, this.config.retryDelay * attempt)
        );
        return this.request(url, init, attempt + 1);
      }

      console.error('API Request failed:', {
        url,
        error: error instanceof Error ? error.message : error,
        attempt,
        headers: init.headers
      });
      throw new NetworkError(
        'Failed to fetch data from API',
        error instanceof Error ? error.message : error
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Get data from the API
   */
  public async get<T = unknown>(model: string): Promise<T> {
    ensureInitialized();
    const state = getState();
    const { dytextClientToken } = state;

    if (!dytextClientToken) {
      throw new ApiError('Missing client token');
    }

    const url = `${this.config.endpoint}/${model}`;

    return this.request<T>(url, {
      headers: {
        [API.HEADERS.CLIENT_TOKEN]: dytextClientToken,
      },
    });
  }
}

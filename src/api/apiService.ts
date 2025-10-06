
import { DytextApiConfig } from '../types/config';
import { DytextApiClient } from './client';

/**
 * API service for handling backend requests
 */
export class DytextApiService {
  private static client: DytextApiClient;

  /**
   * Initialize the API service with configuration
   */
  public static initialize(config?: DytextApiConfig): void {
    this.client = new DytextApiClient(config);
  }

  /**
   * Get a specific model or all models from the API
   */
  public static async get<T = unknown>(model: string): Promise<T> {
    if (!this.client) {
      this.initialize();
    }

    return await this.client.get<T>(model);
  }
}

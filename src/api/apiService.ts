
import { DYTEXT_API_ENDPOINT } from '../utils/constants';
import { ensureInitialized, getState } from '../state/state';

// Pure API service for dytext data
export class DytextApiService {
  // Get a specific model or all models from the real API
  static async get(model: string) {
    ensureInitialized();
    const state = getState();

    const { dytextClientToken } = state;

    const url = `${DYTEXT_API_ENDPOINT}/${model.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-dytext-client-token': dytextClientToken || '',
        },
      });
      
      if (!response.ok) {
        // Return undefined for 404 (not found) errors instead of throwing
        if (response.status === 404) {
          return undefined;
        }

        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return result.data || result;
    } catch (error) {
      console.error('DyText API Error:', error);
      throw error;
    }
  }
}

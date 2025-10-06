// Re-export all types from their respective modules
export * from '../models/models';
export * from '../types/config';
export * from '../types/results';
export * from '../types/paths';

import type { LibraryState } from '../state/state';

// Legacy interfaces maintained for backward compatibility
export interface DyTextClient {
  get<T = any>(path: string): Promise<T>;
  isInitialized(): boolean;
}

export type DyTextState = LibraryState;

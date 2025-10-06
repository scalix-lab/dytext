/**
 * Library state structure
 */
export interface LibraryState {
  initialized: boolean;
  dytextClientToken?: string;
  projectId?: string;
  token?: string;
}

import { StateManager } from './StateManager';

const stateManager = StateManager.getInstance();

export function isInitialized(): boolean {
  return stateManager.isInitialized();
}

export function getState(): LibraryState {
  return stateManager.getState();
}

export function resetState(): void {
  stateManager.reset();
}

export function setState(newState: Partial<LibraryState>): void {
  stateManager.setState(newState);
}

export function ensureInitialized(): void {
  if (!stateManager.isInitialized()) {
    throw new Error('DyText library must be initialized before use. Call initDytext() first.');
  }
}

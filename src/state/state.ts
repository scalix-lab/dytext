import { DyTextState } from '../utils/types';

// Global state management for the library
let state: DyTextState = {
  initialized: false,
  dytextClientToken: undefined,
  projectId: undefined,
  token: undefined
};

export function isInitialized(): boolean {
  return state.initialized;
}

export function getState(): DyTextState {
  return state;
}

export function resetState(): void {
  state = { initialized: false, dytextClientToken: undefined, projectId: undefined, token: undefined };
}

export function setState(newState: Partial<DyTextState>): void {
  state = { ...state, ...newState };
}

export function ensureInitialized(): void {
  if (!state.initialized) {
    throw new Error('DyText library must be initialized before use. Call initDytext() first.');
  }
}

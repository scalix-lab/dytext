/**
 * Library state structure
 */
export interface LibraryState {
  initialized: boolean;
  dytextClientToken?: string;
  projectId?: string;
  token?: string;
}

// Global state management for the library
let state: LibraryState = {
  initialized: false,
  dytextClientToken: undefined,
  projectId: undefined,
  token: undefined
};

export function isInitialized(): boolean {
  return state.initialized;
}

export function getState(): LibraryState {
  return state;
}

export function resetState(): void {
  state = { initialized: false, dytextClientToken: undefined, projectId: undefined, token: undefined };
}

export function setState(newState: Partial<LibraryState>): void {
  state = { ...state, ...newState };
}

export function ensureInitialized(): void {
  if (!state.initialized) {
    throw new Error('DyText library must be initialized before use. Call initDytext() first.');
  }
}

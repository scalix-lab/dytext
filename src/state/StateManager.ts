import type { LibraryState } from "../types/config";

export class StateManager {
  private static instance: StateManager;
  private state: LibraryState = {
    initialized: false,
    dytextClientToken: undefined,
    projectId: undefined,
    token: undefined,
  };

  private constructor() {}

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  getState(): LibraryState {
    return { ...this.state };
  }

  setState(newState: Partial<LibraryState>): void {
    this.state = { ...this.state, ...newState };
  }

  isInitialized(): boolean {
    return this.state.initialized;
  }

  reset(): void {
    this.state = {
      initialized: false,
      dytextClientToken: undefined,
      projectId: undefined,
      token: undefined,
    };
  }
}

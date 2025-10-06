import { LibraryState } from '../state/state';
import { StateManager } from '../state/StateManager';
import { DytextConfig } from '../types/config';
import { parseClientToken } from '../utils/common';
import { ValidationError } from '../errors/errors';
import { dytextCache } from '../state/cache';
import { registry } from './strategies/envstrategy/EnvStrategy';
import { ConfigManager } from '../config/configManager';

export class DytextInstance {
  private static instance: DytextInstance;
  private state: LibraryState;
  private initPromise: Promise<LibraryState> | null = null;

  private stateManager = StateManager.getInstance();

  private constructor() {
    this.state = this.stateManager.getState();
  }

  static getInstance(): DytextInstance {
    if (!DytextInstance.instance) {
      DytextInstance.instance = new DytextInstance();
    }
    return DytextInstance.instance;
  }

  private getEnvToken(): string | undefined {
    const config = ConfigManager.getInstance();
    
    // Try each applicable strategy in order until we find a token
    for (const strategy of registry.getStrategies()) {
      if (strategy.isApplicable?.() ?? true) {
        const token = strategy.getToken();
        if (token) {
          // Apply any framework-specific config
          if (strategy.getConfig) {
            const frameworkConfig = strategy.getConfig();
            config.updateConfig(frameworkConfig);
          }
          return token;
        }
      }
    }
    return undefined;
  }

  async ensureInitialized(): Promise<LibraryState> {
    if (this.state.initialized) {
      return this.state;
    }

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      return this.initPromise;
    }

    throw new Error('DyText library must be initialized before use. Call initDytext() first.');
  }

  async initialize(dytextClientToken?: string, config?: DytextConfig): Promise<LibraryState> {
    // If already initialized, return current state
    if (this.state.initialized) {
      return this.state;
    }

    // If initialization is in progress, wait for it and return the result
    if (this.initPromise) {
      return this.initPromise;
    }

    // Start initialization
    this.initPromise = new Promise<LibraryState>(async (resolve, reject) => {
      try {
        const token = dytextClientToken || this.getEnvToken();
        
        if (!token) {
          throw new ValidationError('dytext_client_token is required. Set it via environment variable or pass to initDytext("YOUR_TOKEN")');
        }

        // Reset cache
        dytextCache.clear();

        // Parse and validate token
        const parsedToken = parseClientToken(token);

        // Update state
        const newState = {
          initialized: true,
          dytextClientToken: token,
          projectId: parsedToken.projectId,
          token: parsedToken.token
        };
        
        // Update state through state manager
        this.stateManager.setState(newState);
        this.state = this.stateManager.getState();
        
        resolve(this.state);
      } catch (err) {
        reject(err);
      }
    });

    try {
      return await this.initPromise;
    } catch (error) {
      const failedState = { initialized: false };
      this.stateManager.setState(failedState);
      this.state = this.stateManager.getState();
      this.initPromise = null;
      throw error;
    }
  }

  getState(): LibraryState {
    return { ...this.state };
  }

  isInitialized(): boolean {
    return this.state.initialized;
  }

  reset(): void {
    this.stateManager.reset();
    this.state = this.stateManager.getState();
    this.initPromise = null;
    dytextCache.clear();
  }
}

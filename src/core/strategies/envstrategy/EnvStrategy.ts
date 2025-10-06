import { DytextConfig } from '../../../types/config';

export interface EnvStrategy {
  /**
   * Get the client token from environment
   */
  getToken(): string | undefined;

  /**
   * Get framework-specific configuration defaults
   */
  getConfig?(): Partial<DytextConfig>;

  /**
   * Check if this strategy is applicable in current environment
   */
  isApplicable?(): boolean;
}

/**
 * Registry of all available environment strategies
 */
export class EnvStrategyRegistry {
  private static instance: EnvStrategyRegistry;
  private strategies: EnvStrategy[] = [];

  private constructor() {}

  static getInstance(): EnvStrategyRegistry {
    if (!EnvStrategyRegistry.instance) {
      EnvStrategyRegistry.instance = new EnvStrategyRegistry();
    }
    return EnvStrategyRegistry.instance;
  }

  register(strategy: EnvStrategy): void {
    this.strategies.push(strategy);
  }

  getStrategies(): EnvStrategy[] {
    return this.strategies;
  }
}

export const registry = EnvStrategyRegistry.getInstance();

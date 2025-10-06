import { DottedPath } from '../../utils/types';
import { ensureInitialized } from '../../state/state';
import { IResolver, IResolutionStrategy } from './interfaces';
import { WildcardResolutionStrategy, ModuleResolutionStrategy } from './strategies';
import { DytextResolutionResult } from '../../types/results';
import { DytextBaseError, ResolutionError } from '../../errors/errors';
import { dytextCache } from '../../state/cache';

export class DytextResolver implements IResolver {
  private strategies: IResolutionStrategy[] = [];
  private resolutionHistory: Map<string, DytextResolutionResult> = new Map();

  constructor() {
    // Register default strategies
    this.addStrategy(new WildcardResolutionStrategy());
    this.addStrategy(new ModuleResolutionStrategy());
  }

  private _trackResolution(path: string, value: any, fromCache: boolean): void {
    this.resolutionHistory.set(path, {
      value,
      path,
      timestamp: Date.now(),
      source: fromCache ? 'cache' : 'api'
    });
  }

  addStrategy(strategy: IResolutionStrategy): void {
    this.strategies.push(strategy);
  }

  async resolve(path: DottedPath): Promise<any> {
    // First check initialization - let this error propagate directly
    ensureInitialized();

    try {
      // Find the first strategy that can handle this path
      const strategy = this.strategies.find(s => s.canResolve(path));
      
      if (!strategy) {
        throw new ResolutionError(`No resolution strategy found for path: ${path}`);
      }

      const result = await strategy.resolve(path);
      
      // Track metadata internally without exposing it in the return value
      if (result !== undefined) {
        this._trackResolution(path, result, result === dytextCache.get(path));
      }

      return result;
    } catch (error) {
      if (error instanceof DytextBaseError) {
        throw error;
      }
      
      throw new ResolutionError(
        `Failed to resolve path: ${path}`,
        error instanceof Error ? error.message : error
      );
    }
  }
}

// Create singleton instance
export const dytextResolver = new DytextResolver();
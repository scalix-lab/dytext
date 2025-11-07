import { DottedPath } from "../../utils/types";
import { StateManager } from "../../state/StateManager";
import { IResolver, IResolutionStrategy } from "./interfaces";
import {
  WildcardResolutionStrategy,
  ModuleResolutionStrategy,
} from "./strategies";
import {
  DytextResolutionResult,
  ResolvedValue,
  ModelData,
} from "../../types/results";
import { DytextBaseError, ResolutionError } from "../../errors/errors";
import { CacheManager } from "../cache/cacheManager";

export class DytextResolver implements IResolver {
  private static instance: DytextResolver;
  private strategies: IResolutionStrategy[] = [];
  private resolutionHistory: Map<string, DytextResolutionResult> = new Map();
  private stateManager = StateManager.getInstance();
  private dytextCache = CacheManager.getInstance().getCache();

  private constructor() {
    // Register default strategies
    this.addStrategy(new WildcardResolutionStrategy());
    this.addStrategy(new ModuleResolutionStrategy());
  }

  static getInstance(): DytextResolver {
    if (!DytextResolver.instance) {
      DytextResolver.instance = new DytextResolver();
    }
    return DytextResolver.instance;
  }

  private _trackResolution(
    path: string,
    value: ResolvedValue,
    fromCache: boolean
  ): void {
    this.resolutionHistory.set(path, {
      value,
      path,
      timestamp: Date.now(),
      source: fromCache ? "cache" : "api",
    });
  }

  addStrategy(strategy: IResolutionStrategy): void {
    this.strategies.push(strategy);
  }

  async resolve<T extends ResolvedValue = ModelData>(
    path: DottedPath
  ): Promise<T> {
    // First check initialization
    if (!this.stateManager.isInitialized()) {
      throw new Error(
        "DyText library must be initialized before use. Call initDytext() first."
      );
    }

    try {
      // Find the first strategy that can handle this path
      const strategy = this.strategies.find((s) => s.canResolve(path));

      if (!strategy) {
        throw new ResolutionError(
          `No resolution strategy found for path: ${path}`
        );
      }

      const result = await strategy.resolve(path);

      // Track metadata internally without exposing it in the return value
      if (result !== undefined) {
        this._trackResolution(
          path,
          result,
          result === this.dytextCache.get(path)
        );
      }

      return result as T;
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

import { LibraryState } from "../types/config";
import { StateManager } from "../state/StateManager";
import { DytextConfig } from "../types/config";
import { parseClientToken } from "../utils/common";
import { ValidationError } from "../errors/errors";
import { DytextResolver } from "./resolver/resolver";
import { registry } from "./strategies/envstrategy/EnvStrategy";
import "./strategies/envstrategy/strategies"; // Import to register strategies
import { ConfigManager } from "../config/configManager";
import { ResolvedValue } from "../types/results";
import { CacheManager } from "./cache/cacheManager";

export class DytextService {
  private static instance: DytextService;
  private stateManager = StateManager.getInstance();
  private resolver = DytextResolver.getInstance();
  private dytextCache = CacheManager.getInstance().getCache();
  private initPromise: Promise<LibraryState> | null = null;

  private constructor() {}

  static getInstance(): DytextService {
    if (!DytextService.instance) {
      DytextService.instance = new DytextService();
    }
    return DytextService.instance;
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

  async initialize(
    dytextClientToken?: string,
    userConfig?: DytextConfig,
  ): Promise<LibraryState> {
    // If already initialized, return current state
    if (this.stateManager.isInitialized()) {
      return this.stateManager.getState();
    }

    // If initialization is in progress, wait for it and return the result
    if (this.initPromise) {
      return this.initPromise;
    }

    // Apply user configuration if provided
    if (userConfig) {
      ConfigManager.getInstance().updateConfig(userConfig);
    }

    // Start initialization
    this.initPromise = (async () => {
      const token = dytextClientToken || this.getEnvToken();

      if (!token) {
        throw new ValidationError(
          'dytext_client_token is required. Set it via environment variable or pass to initDytext("YOUR_TOKEN")',
        );
      }

      // Reset cache
      this.dytextCache.clear();
      this.dytextCache.clear();

      // Parse and validate token
      const parsedToken = parseClientToken(token);

      // Update state
      const newState = {
        initialized: true,
        dytextClientToken: token,
        projectId: parsedToken.projectId,
        token: parsedToken.token,
      };

      // Update state through state manager
      this.stateManager.setState(newState);
      return this.stateManager.getState();
    })();

    try {
      return await this.initPromise;
    } catch (error) {
      this.stateManager.setState({ initialized: false });
      this.initPromise = null;
      throw error;
    }
  }

  async get<T extends ResolvedValue>(path?: string): Promise<T> {
    if (!this.stateManager.isInitialized()) {
      // Auto-initialize from environment (or existing config) if possible
      await this.initialize();
    }
    return this.resolver.resolve<T>(path || "*");
  }

  reset(): void {
    this.stateManager.reset();
    this.initPromise = null;
    this.dytextCache.clear();
    this.dytextCache.clear();
  }
}

import { EnvStrategy } from "../EnvStrategy";
import { DytextConfig } from "../../../../types/config";

export class ViteEnvStrategy implements EnvStrategy {
  getToken(): string | undefined {
    try {
      // @ts-expect-error - Vite's import.meta.env
      return import.meta.env.VITE_DYTEXT_CLIENT_TOKEN;
    } catch {
      return undefined;
    }
  }

  getConfig(): Partial<DytextConfig> {
    return {
      cache: {
        ttl: 300000, // 5 minutes
        enabled: true,
      },
    };
  }

  isApplicable(): boolean {
    try {
      // @ts-expect-error - Check for Vite environment
      return typeof import.meta !== "undefined" && !!import.meta.env;
    } catch {
      return false;
    }
  }
}

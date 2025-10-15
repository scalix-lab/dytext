import { EnvStrategy } from "../EnvStrategy";
import { DytextConfig } from "../../../../types/config";

export class NextEnvStrategy implements EnvStrategy {
  getToken(): string | undefined {
    if (typeof process === "undefined" || !process.env) return undefined;
    // Check DYTEXT_CLIENT_TOKEN first (standard), then Next.js specific NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN
    return process.env.DYTEXT_CLIENT_TOKEN || process.env.NEXT_PUBLIC_DYTEXT_CLIENT_TOKEN;
  }

  getConfig(): Partial<DytextConfig> {
    return {
      cache: {
        // Shorter cache for SSR environments
        ttl: 60000, // 1 minute
        enabled: true,
      },
    };
  }

  isApplicable(): boolean {
    return (
      typeof process !== "undefined" &&
      !!process.env &&
      // Check for Next.js specific environment
      (!!process.env.NEXT_RUNTIME || !!process.env.__NEXT_PROCESSED_ENV)
    );
  }
}

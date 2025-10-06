import { EnvStrategy } from "../EnvStrategy";
import { DytextConfig } from "../../../../types/config";

export class ReactEnvStrategy implements EnvStrategy {
  getToken(): string | undefined {
    if (typeof process === "undefined" || !process.env) return undefined;
    return process.env.REACT_APP_DYTEXT_CLIENT_TOKEN;
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
    return (
      typeof process !== "undefined" &&
      !!process.env &&
      // Check for Create React App environment
      Object.keys(process.env).some((key) => key.startsWith("REACT_APP_"))
    );
  }
}

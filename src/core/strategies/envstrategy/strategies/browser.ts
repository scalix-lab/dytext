import { EnvStrategy } from '../EnvStrategy';
import { DytextConfig } from '../../../../types/config';

export class BrowserEnvStrategy implements EnvStrategy {
  getToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return (window as any).DYTEXT_CLIENT_TOKEN;
  }

  getConfig(): Partial<DytextConfig> {
    return {
      cache: {
        ttl: 600000, // 10 minutes for better offline support
        enabled: true
      }
    };
  }

  isApplicable(): boolean {
    return typeof window !== 'undefined';
  }
}
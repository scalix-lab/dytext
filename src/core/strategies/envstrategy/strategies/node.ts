import { EnvStrategy } from '../EnvStrategy';

export class NodeEnvStrategy implements EnvStrategy {
  getToken(): string | undefined {
    if (typeof process === 'undefined' || !process.env) return undefined;
    return process.env.DYTEXT_CLIENT_TOKEN;
  }

  isApplicable(): boolean {
    return typeof process !== 'undefined' && !!process.env;
  }
}

import { dytextResolver } from './resolver/resolver';

// Main resolver function that delegates to the resolver service
export async function resolveDytext(path: string): Promise<any> {
  return dytextResolver.resolve(path);
}
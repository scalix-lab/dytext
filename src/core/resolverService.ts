// @ts-ignore
import dlv from 'dlv';
import { DytextApiService } from '../api/apiService';
import { dytextCache } from '../state/cache';
import { parseModelPath } from '../utils/common';
import { ensureInitialized } from '../state/state';

// TODO: Move these to its own strategy eventually

async function resolveWildcardOrEmptyPath(path: string): Promise<any> {
  const cached = dytextCache.get(path);
  if (cached !== undefined) return cached;

  const result = await DytextApiService.get('*');
  dytextCache.set(path, result);
  return result;
}

async function resolveModulePath(path: string): Promise<any> {
  const { model, subpath } = parseModelPath(path);
  
  // Check if module is cached
  let moduleObj = dytextCache.get(model);

  if (moduleObj === undefined) {
    moduleObj = await DytextApiService.get(model);
    dytextCache.set(model, moduleObj);
  }
  
  if (!moduleObj) {
    return undefined;
  }
  
  // Resolve subpath locally
  return subpath ? dlv(moduleObj, subpath) : moduleObj;
}

// Resolver with integrated caching
export async function resolveDytext(path: string ): Promise<any> {
  // Ensure library is initialized before resolving
  ensureInitialized();
  
  // For '*' or empty paths, use simple path-based caching
  if (!path || path === '*') {
    return await resolveWildcardOrEmptyPath(path);
  }
  
  // For dotted paths, use module-level caching
  return await resolveModulePath(path);
}
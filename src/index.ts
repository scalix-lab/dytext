import { initDytextService } from './core/init';
import { resolveDytext } from './core/resolverService';

// Initialize the library (calls initDytextService)
export function initDytext(options?: Record<string, any>) {
	return initDytextService(options);
}

// Get context by dotted path from any object
export async function getDytext(path?: string ) {
	return resolveDytext(path || '*');
}


export * from './api/apiService';
export * from './core/init';
export * from './state/cache';
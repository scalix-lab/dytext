import { initDytextService } from './core/init';
import { resolveDytext } from './core/resolverService';
import { DyTextConfig } from './utils/types';

// Initialize the library (calls initDytextService)
export function initDytext(dytextClientToken: string, config?: DyTextConfig) {
	return initDytextService(dytextClientToken, config);
}

// Get context by dotted path from any object
export async function getDytext(path?: string ) {
	return resolveDytext(path || '*');
}

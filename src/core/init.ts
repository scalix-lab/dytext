// Handles initialization logic for the API service
// Extendable for framework-specific bootstrapping

import { isInitialized, setState, getState } from '../state/state';
import { dytextCache } from '../state/cache';
import { DyTextConfig } from '../utils/types';
import { parseClientToken } from '../utils/common';

export function initDytextService(dytextClientToken: string, config?: DyTextConfig) {
  // Validate required token
  if (!dytextClientToken || typeof dytextClientToken !== 'string') {
    throw new Error('dytext_client_token is required and must be a string.');
  }

  // Prevent multiple initializations
  if (isInitialized()) {
    console.warn('DyText is already initialized. Ignoring subsequent initialization.');
    return defaultDytextState();
  }

  // Reset cache on initialization
  dytextCache.clear();

  // Parse and validate client token
  let parsedToken = parseClientToken(dytextClientToken);
  
  // Mark as initialized with token and configuration
  setState({
    initialized: true,
    dytextClientToken: dytextClientToken,
    projectId: parsedToken.projectId,
    token: parsedToken.token
  });
  
  return defaultDytextState()
}

function defaultDytextState() {
  return {
    initialized: getState().initialized,
    dytextClientToken: getState().dytextClientToken,
    projectId: getState().projectId,
    token: getState().token
  };
}

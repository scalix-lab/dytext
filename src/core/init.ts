import { isInitialized, setState, getState } from '../state/state';
import { dytextCache } from '../state/cache';
import { parseClientToken } from '../utils/common';
import { ValidationError } from '../errors/errors';

export function initDytextService(dytextClientToken: string) {
  // Validate required token
  if (!dytextClientToken || typeof dytextClientToken !== 'string') {
    throw new ValidationError('dytext_client_token is required and must be a string.');
  }

  // Prevent multiple initializations
  if (isInitialized()) {
    console.warn('DyText is already initialized. Ignoring subsequent initialization.');
    return getInitializationState();
  }

  // Reset cache on initialization
  dytextCache.clear();

  try {
    // Parse and validate client token
    const parsedToken = parseClientToken(dytextClientToken);
    
    // Mark as initialized with token
    setState({
      initialized: true,
      dytextClientToken: dytextClientToken,
      projectId: parsedToken.projectId,
      token: parsedToken.token
    });
    
    return getInitializationState();
  } catch (error) {
    setState({ initialized: false });
    throw error;
  }
}

function getInitializationState() {
  const state = getState();
  return {
    initialized: state.initialized,
    dytextClientToken: state.dytextClientToken,
    projectId: state.projectId,
    token: state.token
  };
}

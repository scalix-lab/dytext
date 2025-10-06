// Pure function to extract model and subpath from dotted path
export function parseModelPath(path: string): { model: string; subpath: string } {
  const dotIndex = path.indexOf('.');
  const model = dotIndex === -1 ? path : path.substring(0, dotIndex);
  const subpath = dotIndex === -1 ? '' : path.substring(dotIndex + 1);
  return { model, subpath };
}

// Parse dytext client token into projectId and token
export function parseClientToken(clientToken: string): { projectId: string; token: string } {
  const dotIndex = clientToken.indexOf('.');
  if (dotIndex === -1) {
    throw new Error('Invalid dytext_client_token format. Expected format: "PROJECT_ID.TOKEN"');
  }
  
  const projectId = clientToken.substring(0, dotIndex);
  const token = clientToken.substring(dotIndex + 1);
  
  if (!projectId || !token) {
    throw new Error('Invalid dytext_client_token format. Both projectId and token are required.');
  }
  
  return { projectId, token };
}

export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        // Override with source value (including arrays, primitives, null, undefined)
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

// Pure function to extract model and subpath from dotted path
export function parseModelPath(path: string): { model: string; subpath: string } {
  const dotIndex = path.indexOf('.');
  const model = dotIndex === -1 ? path : path.substring(0, dotIndex);
  const subpath = dotIndex === -1 ? '' : path.substring(dotIndex + 1);
  return { model, subpath };
}

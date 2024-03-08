export function intoNestedValue(obj: Record<string, unknown>, path: string) {
  return path
    .split('.')
    .map((key) => key.trim())
    .filter(Boolean)
    .reduce((acc, key) => acc[key], obj);
}

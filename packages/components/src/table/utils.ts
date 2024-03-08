export const collator = new Intl.Collator(void 0, {
  usage: 'sort',
  numeric: true,
  sensitivity: 'variant'
});

export function intoNestedValue(obj: Record<string, unknown>, path: string) {
  return path
    .split('.')
    .map((key) => key.trim())
    .filter(Boolean)
    .reduce((acc, key) => acc[key], obj);
}

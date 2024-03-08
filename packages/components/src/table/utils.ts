// eslint-disable-next-line no-undefined
export const collator = new Intl.Collator(undefined, {
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

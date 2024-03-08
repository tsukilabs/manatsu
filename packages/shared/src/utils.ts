const sortCollator = new Intl.Collator(void 0, {
  usage: 'sort',
  numeric: true,
  sensitivity: 'variant'
});

/**
 * Compare two values so they can be sorted.
 *
 * Both are coerced to strings before being compared with a collator.
 */
export function compare(a: unknown, b: unknown): number {
  return sortCollator.compare(String(a), String(b));
}

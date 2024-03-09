import type { Nullish } from '@tb-dev/utility-types';

export function intoNestedValue(obj: Record<string, unknown>, path: Nullish<string>) {
  if (typeof path !== 'string') return null;
  return path
    .split('.')
    .map((key) => key.trim())
    .filter(Boolean)
    .reduce((acc, key) => acc[key], obj);
}

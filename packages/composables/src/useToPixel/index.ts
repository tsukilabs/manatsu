import { type MaybeRefOrGetter, computed, toRef, toValue } from 'vue';

/**
 * Reactively add the pixel unit to a value.
 * If the value is a string, it is returned unchanged.
 */
export function useToPixel(unit: MaybeRefOrGetter<string | number>) {
  const unitRef = toRef(unit);
  return computed(() => toPixel(unitRef.value));
}

/**
 * Add the pixel unit to a value.
 * If the value is a string, it is returned unchanged.
 *
 * If you want a composable, use {@link useToPixel} instead.
 */
export function toPixel(unit: MaybeRefOrGetter<string | number>): string {
  const value = toValue(unit);
  if (typeof value === 'string') return value;
  return `${value}px`;
}

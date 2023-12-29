import {
  type ComputedRef,
  type MaybeRefOrGetter,
  computed,
  toRef,
  unref
} from 'vue';

export type PixelRecord = Record<string, MaybeRefOrGetter<string | number>>;

export function useToPixel(
  unit: MaybeRefOrGetter<string | number>
): ComputedRef<string>;
export function useToPixel(
  unit: MaybeRefOrGetter<PixelRecord>
): ComputedRef<Record<string, string>>;
export function useToPixel(
  unit: MaybeRefOrGetter<string | number | PixelRecord>
) {
  const unitRef = toRef(unit);

  return computed(() => {
    if (typeof unitRef.value !== 'object') return toPixel(unitRef.value);

    return Object.entries(unitRef.value).reduce<Record<string, string>>(
      (record, [key, value]) => {
        record[key] = toPixel(value);
        return record;
      },
      {}
    );
  });
}

/**
 * Adds the pixel unit to a value.
 * If the value is a string, it is returned unchanged.
 *
 * If you want a composable, use {@link useToPixel} instead.
 */
export function toPixel(unit: MaybeRefOrGetter<string | number>): string {
  let value = unref(unit);
  if (typeof value === 'function') value = value();

  if (typeof value === 'string') return value;
  return `${value}px`;
}

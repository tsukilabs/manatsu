import {
  type ComputedRef,
  type MaybeRefOrGetter,
  computed,
  toRef,
  unref
} from 'vue';

export type PixelRecord<T extends string> = Record<
  T,
  MaybeRefOrGetter<string | number>
>;

export function useToPixel(
  unit: MaybeRefOrGetter<string | number>
): ComputedRef<string>;
export function useToPixel<T extends PixelRecord<string>, K extends keyof T>(
  unit: MaybeRefOrGetter<T>
): ComputedRef<Record<K, string>>;
export function useToPixel<T extends PixelRecord<string>, K extends keyof T>(
  unit: MaybeRefOrGetter<string | number | T>
) {
  const unitRef = toRef(unit);

  return computed(() => {
    if (typeof unitRef.value !== 'object') return toPixel(unitRef.value);

    return Object.entries(unitRef.value).reduce<Record<K, string>>(
      (record, [key, value]) => {
        record[key as K] = toPixel(value);
        return record;
      },

      /** @see https://typescript-eslint.io/rules/prefer-reduce-type-parameter/#when-not-to-use-it */
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      {} as Record<K, string>
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

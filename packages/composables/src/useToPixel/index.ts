import { computed, toRef } from 'vue';
import { toPixel } from '@tb-dev/utils';
import type { MaybeNullishRef } from '@manatsu/shared';

interface UseToPixelOptions {
  /**
   * Default value if nullish.
   * @default '0px'
   */
  default?: string;
}

/**
 * Reactively add the pixel unit to a value.
 * If the value is a string, it is returned unchanged.
 */
export function useToPixel(
  unit: MaybeNullishRef<string | number>,
  options: UseToPixelOptions = {}
) {
  const unitRef = toRef(unit);
  return computed(() => {
    if (!unitRef.value) return options.default ?? '0px';
    return toPixel(unitRef.value);
  });
}

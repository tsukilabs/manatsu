import type { MaybeNullishRef } from '@manatsu/shared';
import { type ComputedRef, type MaybeRefOrGetter, computed, toRef } from 'vue';

export function useBorder(
  border: MaybeNullishRef<string | boolean>,
  defaultBorder: MaybeRefOrGetter<string>
): ComputedRef<string> {
  const borderRef = toRef(border);
  const defaultBorderRef = toRef(defaultBorder);

  return computed(() => {
    if (!borderRef.value) return 'none';
    if (typeof borderRef.value === 'string') return borderRef.value;
    return defaultBorderRef.value;
  });
}

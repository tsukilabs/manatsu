import { type MaybeRefOrGetter, computed, toRef } from 'vue';

export function useToPixel(unit: MaybeRefOrGetter<string | number>) {
  const unitRef = toRef(unit);

  return computed(() => {
    if (typeof unitRef.value === 'string') return unitRef.value;
    return `${unitRef.value}px`;
  });
}

import { toArray } from '@tb-dev/utils';
import { type MaybeRefOrGetter, computed, toRef } from 'vue';

export function useToArray(value: MaybeRefOrGetter<unknown>) {
  const valueRef = toRef(value);
  return computed(() => toArray(valueRef.value));
}

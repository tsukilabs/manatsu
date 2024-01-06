import { isEmpty } from '@tb-dev/utils';
import type { Nullish } from '@tb-dev/utility-types';
import { type ComputedRef, type MaybeRefOrGetter, computed, toRef } from 'vue';

export function useIsEmpty(value: MaybeRefOrGetter<Nullish<string>>): ComputedRef<boolean>;
export function useIsEmpty<T>(value: MaybeRefOrGetter<Nullish<T[]>>): ComputedRef<boolean>;
export function useIsEmpty<K>(value: MaybeRefOrGetter<Nullish<Set<K>>>): ComputedRef<boolean>;
export function useIsEmpty<K, V>(value: MaybeRefOrGetter<Nullish<Map<K, V>>>): ComputedRef<boolean>;
export function useIsEmpty(value: MaybeRefOrGetter<unknown>): ComputedRef<boolean> {
  const valueRef = toRef(value);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return computed(() => isEmpty(valueRef.value as any));
}

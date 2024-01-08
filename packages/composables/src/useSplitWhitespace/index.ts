import { computed, toRef } from 'vue';
import { splitWhitespace } from '@tb-dev/utils';
import type { MaybeNullishRef } from '@manatsu/shared';
import type { MaybeArray } from '@tb-dev/utility-types';

export function useSplitWhitespace(value: MaybeNullishRef<MaybeArray<string>>) {
  const valueRef = toRef(value);
  return computed(() => splitWhitespace(valueRef.value));
}

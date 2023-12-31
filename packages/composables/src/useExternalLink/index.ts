import type { RouteLocationRaw } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';
import { type MaybeRefOrGetter, computed, toRef } from 'vue';

export function useExternalLink(
  link: MaybeRefOrGetter<Nullish<RouteLocationRaw>>
) {
  const linkRef = toRef(link);
  return computed(() => isExternalLink(linkRef.value));
}

export function isExternalLink(url: Nullish<RouteLocationRaw>): boolean {
  if (typeof url === 'string') {
    return url.startsWith('http');
  }

  return false;
}

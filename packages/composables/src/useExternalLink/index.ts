import { computed, toRef } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { Nullish } from '@tb-dev/utility-types';
import type { MaybeNullishRef } from '@manatsu/shared';

export function useExternalLink(link: MaybeNullishRef<RouteLocationRaw>) {
  const linkRef = toRef(link);
  return computed(() => isExternalLink(linkRef.value));
}

export function isExternalLink(url: Nullish<RouteLocationRaw>): boolean {
  if (typeof url === 'string') {
    return url.startsWith('http');
  }

  return false;
}

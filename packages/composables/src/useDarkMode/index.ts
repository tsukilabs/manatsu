import { type Ref, inject, ref } from 'vue';
import { type DarkMode, darkModeKey } from '@manatsu/shared';

export function useDarkMode(): Ref<DarkMode> {
  return inject(darkModeKey, () => ref<boolean | 'auto'>('auto'), true);
}

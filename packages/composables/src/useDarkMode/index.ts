import { usePreferredDark } from '@vueuse/core';
import { type ManatsuOptions, darkModeKey } from '@manatsu/shared';
import { type Ref, hasInjectionContext, inject, ref, watchEffect } from 'vue';

export function useDarkMode() {
  let darkMode: Ref<NonNullable<ManatsuOptions['darkMode']>>;

  if (hasInjectionContext()) {
    darkMode = inject(darkModeKey, () => ref<boolean | 'auto'>('auto'), true);
  } else {
    darkMode = ref('auto');
  }

  const preferredDark = usePreferredDark();
  watchEffect(() => {
    if (darkMode.value === 'auto') {
      toggleDarkMode(preferredDark.value);
    } else {
      toggleDarkMode(darkMode.value);
    }
  });

  return darkMode;
}

export function toggleDarkMode(active: boolean) {
  const body = document.body;
  let classes = (body.getAttribute('class') ?? '').split(' ');
  classes = classes.map((c) => c.trim()).filter(Boolean);

  const manatsuDark = 'manatsu-dark';
  if (active && !classes.includes(manatsuDark)) {
    classes.push(manatsuDark);
  } else if (!active && classes.includes(manatsuDark)) {
    classes.splice(classes.indexOf(manatsuDark), 1);
  }

  body.setAttribute('class', classes.join(' '));
}

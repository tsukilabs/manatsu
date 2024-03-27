import { usePreferredDark } from '@vueuse/core';
import { splitWhitespace } from '@tb-dev/utils/array';
import { type DarkMode, symbols } from '@manatsu/shared';
import { type App, type MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';

export function isDarkMode(): boolean {
  return document.body.matches('.manatsu-dark');
}

export function setDarkMode(darkMode: MaybeRefOrGetter<boolean>) {
  const active = toValue(darkMode);

  const body = document.body;
  const classes = splitWhitespace(body.getAttribute('class') ?? '');

  const manatsuDark = 'manatsu-dark';
  if (active && !classes.includes(manatsuDark)) {
    classes.push(manatsuDark);
  } else if (!active && classes.includes(manatsuDark)) {
    classes.splice(classes.indexOf(manatsuDark), 1);
  }

  body.setAttribute('class', classes.join(' '));
}

export function provideDarkMode(app: App, initial: DarkMode = 'auto') {
  const darkModeRef = ref(initial);
  app.provide(symbols.darkMode, darkModeRef);

  const preferredDark = usePreferredDark();
  watchEffect(() => {
    if (darkModeRef.value === 'auto') {
      setDarkMode(preferredDark.value);
    } else {
      setDarkMode(darkModeRef.value);
    }
  });
}

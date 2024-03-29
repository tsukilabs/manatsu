import { usePreferredDark } from '@vueuse/core';
import { splitWhitespace } from '@tb-dev/utils/array';
import { type DarkMode, injectStrict, symbols } from '@manatsu/shared';
import { type App, type MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';

export function isDarkMode(): boolean {
  return document.body.matches('.manatsu-dark');
}

export function setDarkMode(mode: DarkMode) {
  const darkModeRef = injectStrict(symbols.darkMode);
  darkModeRef.value = mode;
}

export function toggleDarkMode() {
  const darkModeRef = injectStrict(symbols.darkMode);
  darkModeRef.value = !isDarkMode();
}

export function provideDarkMode(app: App, initial: DarkMode = 'auto') {
  const darkModeRef = ref(initial);
  app.provide(symbols.darkMode, darkModeRef);

  const preferredDark = usePreferredDark();
  watchEffect(() => {
    if (darkModeRef.value === 'auto') {
      updateBodyClass(preferredDark.value);
    } else {
      updateBodyClass(darkModeRef.value);
    }
  });
}

function updateBodyClass(darkMode: MaybeRefOrGetter<boolean>) {
  const body = document.body;
  const classes = splitWhitespace(body.getAttribute('class'));

  const active = toValue(darkMode);
  const manatsuDark = 'manatsu-dark';

  if (active && !classes.includes(manatsuDark)) {
    classes.push(manatsuDark);
  } else if (!active && classes.includes(manatsuDark)) {
    classes.splice(classes.indexOf(manatsuDark), 1);
  }

  body.setAttribute('class', classes.join(' '));
}

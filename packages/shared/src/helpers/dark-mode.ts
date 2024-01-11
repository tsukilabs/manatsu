import { splitWhitespace } from '@tb-dev/utils';
import { type MaybeRefOrGetter, toValue } from 'vue';

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

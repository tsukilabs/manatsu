import { type MaybeRefOrGetter, toValue } from 'vue';

export function toggleDarkMode(darkMode: MaybeRefOrGetter<boolean>) {
  const active = toValue(darkMode);

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

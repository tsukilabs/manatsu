export function setDarkMode(darkMode: boolean) {
  const body = document.body;
  let classes = (body.getAttribute('class') ?? '').split(' ');
  classes = classes.map((c) => c.trim()).filter(Boolean);

  const manatsuDark = 'manatsu-dark';
  if (darkMode && !classes.includes(manatsuDark)) {
    classes.push(manatsuDark);
  } else if (!darkMode && classes.includes(manatsuDark)) {
    classes.splice(classes.indexOf(manatsuDark), 1);
  }

  body.setAttribute('class', classes.join(' '));
}

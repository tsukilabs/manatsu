import { trimArray } from '@tb-dev/utils/array';

export function css(text: TemplateStringsArray, ...subs: unknown[]): Record<string, string> {
  const result: Record<string, string> = {};

  const rules = String.raw(text, ...subs).replace(/\/\*[^]*?\*\//g, '');

  for (const rule of rules.split(/;(?![^(]*\))/g)) {
    const [key, value] = trimArray(rule.split(/:([^]+)/));
    if (key && value) {
      result[key] = value;
    }
  }

  return result;
}

export function tw(text: TemplateStringsArray, ...subs: unknown[]): string {
  return String.raw(text, ...subs)
    .replace(/\s+/g, ' ')
    .trim();
}

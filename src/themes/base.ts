import type { Rule } from 'unocss';
import type { CSSProperties } from 'vue';

export const rules: Rule[] = [
    ['m-button', { padding: '100px', color: 'green' } satisfies CSSProperties]
];

import config from '@tb-dev/eslint-config';

export default config({
  vitest: true,
  vue: true,
  project: [
    'tsconfig.json',
    'packages/components/tsconfig.json',
    'packages/composables/tsconfig.json',
    'packages/manatsu/tsconfig.json',
    'packages/playground/tsconfig.json',
    'packages/shared/tsconfig.json',
    'packages/tauri-plugin/tsconfig.json'
  ],
  overrides: {
    typescript: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off'
    },
    vue: {
      'vue/block-lang': [
        'error',
        { script: { lang: 'ts' }, style: { lang: 'scss', allowNoLang: false } }
      ],
      'vue/enforce-style-attribute': ['error', { allow: ['plain'] }]
    }
  }
});

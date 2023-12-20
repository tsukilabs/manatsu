import config from '@tb-dev/eslint-config';

export default config({
  vitest: true,
  vue: true,
  project: [
    'tsconfig.json',
    'packages/components/tsconfig.json',
    'packages/composables/tsconfig.json',
    'packages/manatsu/tsconfig.json',
    'packages/playground/tsconfig.json'
  ],
  overrides: {
    vue: {
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts'
          },
          style: {
            lang: 'scss',
            allowNoLang: false
          }
        }
      ]
    }
  }
});

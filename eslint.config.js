import config from '@tb-dev/eslint-config';

export default config({
  vue: true,
  project: [
    'tsconfig.json',
    'packages/components/tsconfig.json',
    'packages/manatsu/tsconfig.json',
    'packages/playground/tsconfig.json'
  ]
});

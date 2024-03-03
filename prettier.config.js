/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-css-order', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  vueIndentScriptAndStyle: false,

  tailwindConfig: './packages/playground/tailwind.config.js',
  tailwindAttributes: [
    'center-class',
    'content-class',
    'end-class',
    'footer-class',
    'header-class',
    'sidebar-item-class',
    'start-class'
  ]
};

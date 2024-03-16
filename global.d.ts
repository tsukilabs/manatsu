import type { App } from 'vue';

declare global {
  // eslint-disable-next-line no-inner-declarations, no-var, @typescript-eslint/naming-convention
  var __MANATSU__: {
    readonly app: App;
  };
}

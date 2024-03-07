import { type App, readonly, ref } from 'vue';
import { privateSymbols } from '@manatsu/shared';

export function provideDialog(app: App, scaffold = true) {
  const scaffoldDialog = ref(scaffold);
  app.provide(privateSymbols.scaffoldDialog, readonly(scaffoldDialog));
}

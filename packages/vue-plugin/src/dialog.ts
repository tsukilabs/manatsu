import { type App, readonly, ref } from 'vue';
import { privateSymbols } from '@manatsu/shared';

export function provideDialog(app: App, placeDialogOnScaffold = true) {
  const scaffold = ref(placeDialogOnScaffold);
  app.provide(privateSymbols.placeDialogOnScaffold, readonly(scaffold));
}

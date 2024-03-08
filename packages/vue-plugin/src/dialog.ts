import type { Nullish } from '@tb-dev/utility-types';
import { type DialogOptions, privateSymbols } from '@manatsu/shared';
import { type App, type Component, readonly, ref, shallowRef } from 'vue';

type Props = Record<string, unknown> | null;

export function provideDialog(app: App, placeDialogOnScaffold = true) {
  const scaffold = ref(placeDialogOnScaffold);
  app.provide(privateSymbols.placeDialogOnScaffold, readonly(scaffold));

  const visible = ref(false);
  app.provide(privateSymbols.dynDialogVisible, visible);

  const options = shallowRef<DialogOptions | null>(null);
  app.provide(privateSymbols.dynDialogOptions, options);

  const defaultSlot = shallowRef<Component | null>(null);
  const defaultSlotProps = shallowRef<Props>(null);
  app.provide(privateSymbols.dynDialogDefault, defaultSlot);
  app.provide(privateSymbols.dynDialogDefaultProps, defaultSlotProps);

  const headerSlot = shallowRef<Component | null>(null);
  const headerSlotProps = shallowRef<Props>(null);
  app.provide(privateSymbols.dynDialogHeader, headerSlot);
  app.provide(privateSymbols.dynDialogHeaderProps, headerSlotProps);

  const footerSlot = shallowRef<Component | null>(null);
  const footerSlotProps = shallowRef<Props>(null);
  app.provide(privateSymbols.dynDialogFooter, footerSlot);
  app.provide(privateSymbols.dynDialogFooterProps, footerSlotProps);

  const onHide = shallowRef<Nullish<() => void>>(null);
  const onShow = shallowRef<Nullish<() => void>>(null);
  app.provide(privateSymbols.dynDialogOnHide, onHide);
  app.provide(privateSymbols.dynDialogOnShow, onShow);
}

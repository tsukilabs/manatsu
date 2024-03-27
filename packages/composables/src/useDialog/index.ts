import type { Nullish } from '@tb-dev/utility-types';
import { type DialogOptions, injectStrict, privateSymbols } from '@manatsu/shared';
import {
  type AllowedComponentProps,
  type Component,
  type ComponentInstance,
  type ShallowRef,
  type VNodeProps,
  isRef
} from 'vue';

type ComponentProps<C extends Component> = Omit<
  ComponentInstance<C>['$props'],
  keyof AllowedComponentProps | keyof VNodeProps
>;

interface UseDialogReturn {
  close: () => void;
  show: () => void;

  setContent: <C extends Component>(
    component: Nullish<C>,
    props?: Nullish<ComponentProps<C>>
  ) => void;
  setFooter: <C extends Component>(
    component: Nullish<C>,
    props?: Nullish<ComponentProps<C>>
  ) => void;
  setHeader: <C extends Component>(
    component: Nullish<C>,
    props?: Nullish<ComponentProps<C>>
  ) => void;
  setOptions: (options: Nullish<DialogOptions>) => void;

  on: (event: 'hide' | 'show', fn: Nullish<() => void>) => void;
}

export function useDialog(options: Nullish<DialogOptions> = null): UseDialogReturn {
  const visible = injectStrict(privateSymbols.dynDialogVisible);
  const optionsRef = injectStrict(privateSymbols.dynDialogOptions);
  const onHideRef = injectStrict(privateSymbols.dynDialogOnHide);
  const onShowRef = injectStrict(privateSymbols.dynDialogOnShow);

  optionsRef.value = options;

  const setContentFn = setContent();
  const setFooterFn = setFooter();
  const setHeaderFn = setHeader();
  const setOptionsFn = setOptions(optionsRef);

  const listener: UseDialogReturn['on'] = (event, fn) => {
    switch (event) {
      case 'hide':
        onHideRef.value = fn;
        break;
      case 'show':
        onShowRef.value = fn;
        break;
    }
  };

  function show() {
    visible.value = true;
  }

  function close() {
    visible.value = false;

    setContentFn(null);
    setFooterFn(null);
    setHeaderFn(null);
    setOptionsFn(null);

    if (isRef(onHideRef)) onHideRef.value = null;
    if (isRef(onShowRef)) onShowRef.value = null;
  }

  return {
    close,
    show,

    setContent: setContentFn,
    setFooter: setFooterFn,
    setHeader: setHeaderFn,
    setOptions: setOptionsFn,

    on: listener
  };
}

function setHeader() {
  const headerSlot = injectStrict(privateSymbols.dynDialogHeader);
  const headerSlotProps = injectStrict(privateSymbols.dynDialogHeaderProps);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    headerSlot.value = component;
    headerSlotProps.value = component ? props : null;
  };
}

function setContent() {
  const defaultSlot = injectStrict(privateSymbols.dynDialogDefault);
  const defaultSlotProps = injectStrict(privateSymbols.dynDialogDefaultProps);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    defaultSlot.value = component;
    defaultSlotProps.value = component ? props : null;
  };
}

function setFooter() {
  const footerSlot = injectStrict(privateSymbols.dynDialogFooter);
  const footerSlotProps = injectStrict(privateSymbols.dynDialogFooterProps);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    footerSlot.value = component;
    footerSlotProps.value = component ? props : null;
  };
}

function setOptions(optionsRef: ShallowRef<Nullish<DialogOptions>>) {
  return function (options: Nullish<DialogOptions>) {
    optionsRef.value = options;
  };
}

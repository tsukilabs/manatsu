import type { Nullish } from '@tb-dev/utility-types';
import {
  type DialogOptions,
  type InjectStrictOptions,
  injectStrict,
  privateSymbols
} from '@manatsu/shared';
import {
  type AllowedComponentProps,
  type Component,
  type ComponentInstance,
  type Ref,
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
  reset: () => void;
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

function createInjectOptions(): InjectStrictOptions {
  return {
    error: 'useDialog must be called within a provider'
  };
}

export function useDialog(options: Nullish<DialogOptions> = null): UseDialogReturn {
  const injectOptions = createInjectOptions();
  const visible = injectStrict(privateSymbols.dynDialogVisible, injectOptions);
  const optionsRef = injectStrict(privateSymbols.dynDialogOptions, injectOptions);
  const onHideRef = injectStrict(privateSymbols.dynDialogOnHide, injectOptions);
  const onShowRef = injectStrict(privateSymbols.dynDialogOnShow, injectOptions);

  optionsRef.value = options;

  const closeFn = close(visible);
  const showFn = show(visible);

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

  function reset() {
    setContentFn(null);
    setFooterFn(null);
    setHeaderFn(null);
    setOptionsFn(null);

    if (isRef(onHideRef)) onHideRef.value = null;
    if (isRef(onShowRef)) onShowRef.value = null;

    closeFn();
  }

  return {
    close: closeFn,
    reset,
    show: showFn,

    setContent: setContentFn,
    setFooter: setFooterFn,
    setHeader: setHeaderFn,
    setOptions: setOptionsFn,

    on: listener
  };
}

function show(visible: Ref<boolean>) {
  return function () {
    visible.value = true;
  };
}

function close(visible: Ref<boolean>) {
  return function () {
    visible.value = false;
  };
}

function setHeader() {
  const injectOptions = createInjectOptions();
  const headerSlot = injectStrict(privateSymbols.dynDialogHeader, injectOptions);
  const headerSlotProps = injectStrict(privateSymbols.dynDialogHeaderProps, injectOptions);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    headerSlot.value = component;
    if (component) {
      headerSlotProps.value = props;
    } else {
      headerSlotProps.value = null;
    }
  };
}

function setContent() {
  const injectOptions = createInjectOptions();
  const defaultSlot = injectStrict(privateSymbols.dynDialogDefault, injectOptions);
  const defaultSlotProps = injectStrict(privateSymbols.dynDialogDefaultProps, injectOptions);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    defaultSlot.value = component;
    if (component) {
      defaultSlotProps.value = props;
    } else {
      defaultSlotProps.value = null;
    }
  };
}

function setFooter() {
  const injectOptions = createInjectOptions();
  const footerSlot = injectStrict(privateSymbols.dynDialogFooter, injectOptions);
  const footerSlotProps = injectStrict(privateSymbols.dynDialogFooterProps, injectOptions);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    footerSlot.value = component;
    if (component) {
      footerSlotProps.value = props;
    } else {
      footerSlotProps.value = null;
    }
  };
}

function setOptions(optionsRef: ShallowRef<Nullish<DialogOptions>>) {
  return function (options: Nullish<DialogOptions>) {
    optionsRef.value = options;
  };
}

import type { Nullish } from '@tb-dev/utility-types';
import { DialogError, type DialogOptions, privateSymbols } from '@manatsu/shared';
import {
  type AllowedComponentProps,
  type Component,
  type ComponentInstance,
  type Ref,
  type ShallowRef,
  type VNodeProps,
  hasInjectionContext,
  inject,
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

export function useDialog(options: Nullish<DialogOptions> = null): UseDialogReturn {
  if (!hasInjectionContext()) {
    throw new DialogError('useDialog must be called inside a component');
  }

  const visible = inject(privateSymbols.dynDialogVisible);
  const optionsRef = inject(privateSymbols.dynDialogOptions);

  if (!isRef(visible) || !isRef(optionsRef)) {
    throw new DialogError('no dialog provider found');
  }

  optionsRef.value = options;

  const onHideRef = inject(privateSymbols.dynDialogOnHide);
  const onShowRef = inject(privateSymbols.dynDialogOnShow);

  const closeFn = close(visible);
  const showFn = show(visible);

  const setContentFn = setContent();
  const setFooterFn = setFooter();
  const setHeaderFn = setHeader();
  const setOptionsFn = setOptions(optionsRef);

  const listener: UseDialogReturn['on'] = (event, fn) => {
    switch (event) {
      case 'hide':
        if (isRef(onHideRef)) onHideRef.value = fn;
        break;
      case 'show':
        if (isRef(onShowRef)) onShowRef.value = fn;
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
  const headerSlot = inject(privateSymbols.dynDialogHeader);
  const headerSlotProps = inject(privateSymbols.dynDialogHeaderProps);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    if (isRef(headerSlot)) headerSlot.value = component;
    if (isRef(headerSlotProps)) {
      if (component) {
        headerSlotProps.value = props;
      } else {
        headerSlotProps.value = null;
      }
    }
  };
}

function setContent() {
  const defaultSlot = inject(privateSymbols.dynDialogDefault);
  const defaultSlotProps = inject(privateSymbols.dynDialogDefaultProps);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    if (isRef(defaultSlot)) defaultSlot.value = component;
    if (isRef(defaultSlotProps)) {
      if (component) {
        defaultSlotProps.value = props;
      } else {
        defaultSlotProps.value = null;
      }
    }
  };
}

function setFooter() {
  const footerSlot = inject(privateSymbols.dynDialogFooter);
  const footerSlotProps = inject(privateSymbols.dynDialogFooterProps);

  return function <C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    if (isRef(footerSlot)) footerSlot.value = component;
    if (isRef(footerSlotProps)) {
      if (component) {
        footerSlotProps.value = props;
      } else {
        footerSlotProps.value = null;
      }
    }
  };
}

function setOptions(optionsRef: ShallowRef<Nullish<DialogOptions>>) {
  return function (options: Nullish<DialogOptions>) {
    optionsRef.value = options;
  };
}

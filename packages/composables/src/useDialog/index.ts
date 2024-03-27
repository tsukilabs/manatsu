import type { Nullish } from '@tb-dev/utility-types';
import type { AllowedComponentProps, Component, ComponentInstance, VNodeProps } from 'vue';
import {
  type DialogEvent,
  type DialogOptions,
  injectStrict,
  privateSymbols
} from '@manatsu/shared';

type ComponentProps<C extends Component> = Omit<
  ComponentInstance<C>['$props'],
  keyof AllowedComponentProps | keyof VNodeProps
>;

interface UseDialogReturn {
  close: () => void;
  show: () => void;

  on: (event: DialogEvent, fn: Nullish<() => void>) => void;

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
}

class Dialog {
  private defaultSlot: Nullish<Component> = null;
  private defaultSlotProps: Nullish<Record<string, unknown>> = null;
  private footerSlot: Nullish<Component> = null;
  private footerSlotProps: Nullish<Record<string, unknown>> = null;
  private headerSlot: Nullish<Component> = null;
  private headerSlotProps: Nullish<Record<string, unknown>> = null;

  private onHide: Nullish<() => void> = null;
  private onShow: Nullish<() => void> = null;

  private readonly refs = {
    visible: injectStrict(privateSymbols.dynDialogVisible),
    options: injectStrict(privateSymbols.dynDialogOptions),
    headerSlot: injectStrict(privateSymbols.dynDialogHeader),
    headerSlotProps: injectStrict(privateSymbols.dynDialogHeaderProps),
    defaultSlot: injectStrict(privateSymbols.dynDialogDefault),
    defaultSlotProps: injectStrict(privateSymbols.dynDialogDefaultProps),
    footerSlot: injectStrict(privateSymbols.dynDialogFooter),
    footerSlotProps: injectStrict(privateSymbols.dynDialogFooterProps),
    onHideRef: injectStrict(privateSymbols.dynDialogOnHide),
    onShowRef: injectStrict(privateSymbols.dynDialogOnShow)
  };

  constructor(private options: Nullish<DialogOptions>) {}

  public close() {
    this.refs.visible.value = false;
    this.refs.options.value = null;

    this.refs.defaultSlot.value = null;
    this.refs.defaultSlotProps.value = null;
    this.refs.headerSlot.value = null;
    this.refs.headerSlotProps.value = null;
    this.refs.footerSlot.value = null;
    this.refs.footerSlotProps.value = null;

    this.refs.onHideRef.value = null;
    this.refs.onShowRef.value = null;
  }

  public on(event: DialogEvent, fn: Nullish<() => void>) {
    switch (event) {
      case 'hide':
        this.onHide = fn;
        break;
      case 'show':
        this.onShow = fn;
        break;
    }
  }

  public setContent<C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    this.defaultSlot = component;
    this.defaultSlotProps = component ? props : null;
  }

  public setFooter<C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    this.footerSlot = component;
    this.footerSlotProps = component ? props : null;
  }

  public setHeader<C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    this.headerSlot = component;
    this.headerSlotProps = component ? props : null;
  }

  public setOptions(options: Nullish<DialogOptions>) {
    this.options = options;
  }

  public show() {
    this.refs.defaultSlot.value = this.defaultSlot;
    this.refs.defaultSlotProps.value = this.defaultSlotProps;
    this.refs.headerSlot.value = this.headerSlot;
    this.refs.headerSlotProps.value = this.headerSlotProps;
    this.refs.footerSlot.value = this.footerSlot;
    this.refs.footerSlotProps.value = this.footerSlotProps;

    this.refs.onShowRef.value = this.onShow;
    this.refs.onHideRef.value = this.onHide;

    this.refs.options.value = this.options;
    this.refs.visible.value = true;
  }
}

export function useDialog(options: Nullish<DialogOptions> = null): UseDialogReturn {
  const dialog = new Dialog(options);
  return {
    close: dialog.close.bind(dialog),
    on: dialog.on.bind(dialog),
    setContent: dialog.setContent.bind(dialog),
    setFooter: dialog.setFooter.bind(dialog),
    setHeader: dialog.setHeader.bind(dialog),
    setOptions: dialog.setOptions.bind(dialog),
    show: dialog.show.bind(dialog)
  };
}

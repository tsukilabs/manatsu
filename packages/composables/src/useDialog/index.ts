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

  content: <C extends Component>(component: Nullish<C>, props?: Nullish<ComponentProps<C>>) => void;
  footer: <C extends Component>(component: Nullish<C>, props?: Nullish<ComponentProps<C>>) => void;
  header: <C extends Component>(component: Nullish<C>, props?: Nullish<ComponentProps<C>>) => void;
  options: (options: Nullish<DialogOptions>) => void;
}

class Dialog {
  readonly #id = Symbol();
  #options: Nullish<DialogOptions>;

  #defaultSlot: Nullish<Component> = null;
  #defaultSlotProps: Nullish<Record<string, unknown>> = null;
  #footerSlot: Nullish<Component> = null;
  #footerSlotProps: Nullish<Record<string, unknown>> = null;
  #headerSlot: Nullish<Component> = null;
  #headerSlotProps: Nullish<Record<string, unknown>> = null;

  #onHide: Nullish<() => void> = null;
  #onShow: Nullish<() => void> = null;

  readonly #refs = {
    id: injectStrict(privateSymbols.dynDialogId),
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

  constructor(options: Nullish<DialogOptions>) {
    this.#options = options;
  }

  public show() {
    this.setContent();
    this.setHeader();
    this.setFooter();
    this.setListeners();
    this.setOptions();

    this.#refs.visible.value = true;
    this.#refs.id.value = this.#id;
  }

  public close() {
    if (this.#refs.id.value !== this.#id) return;

    this.#refs.id.value = null;
    this.#refs.visible.value = false;
    this.unsetAll();
  }

  private unsetAll() {
    this.#refs.options.value = null;

    this.#refs.defaultSlot.value = null;
    this.#refs.defaultSlotProps.value = null;
    this.#refs.headerSlot.value = null;
    this.#refs.headerSlotProps.value = null;
    this.#refs.footerSlot.value = null;
    this.#refs.footerSlotProps.value = null;

    this.#refs.onHideRef.value = null;
    this.#refs.onShowRef.value = null;
  }

  public on(event: DialogEvent, fn: Nullish<() => void>) {
    switch (event) {
      case 'hide':
        this.#onHide = fn;
        break;
      case 'show':
        this.#onShow = fn;
        break;
    }
  }

  private setListeners() {
    this.#refs.onHideRef.value = this.#onHide;
    this.#refs.onShowRef.value = this.#onShow;
  }

  public content<C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    this.#defaultSlot = component;
    this.#defaultSlotProps = component ? props : null;

    if (this.#refs.id.value === this.#id) {
      this.setContent();
    }
  }

  private setContent() {
    this.#refs.defaultSlot.value = this.#defaultSlot;
    this.#refs.defaultSlotProps.value = this.#defaultSlotProps;
  }

  public header<C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    this.#headerSlot = component;
    this.#headerSlotProps = component ? props : null;

    if (this.#refs.id.value === this.#id) {
      this.setHeader();
    }
  }

  private setHeader() {
    this.#refs.headerSlot.value = this.#headerSlot;
    this.#refs.headerSlotProps.value = this.#headerSlotProps;
  }

  public footer<C extends Component>(
    component: Nullish<C>,
    props: Nullish<ComponentProps<C>> = null
  ) {
    this.#footerSlot = component;
    this.#footerSlotProps = component ? props : null;

    if (this.#refs.id.value === this.#id) {
      this.setFooter();
    }
  }

  private setFooter() {
    this.#refs.footerSlot.value = this.#footerSlot;
    this.#refs.footerSlotProps.value = this.#footerSlotProps;
  }

  public options(options: Nullish<DialogOptions>) {
    this.#options = options;
  }

  private setOptions() {
    this.#refs.options.value = this.#options;
  }
}

export function useDialog(options: Nullish<DialogOptions> = null): UseDialogReturn {
  const dialog = new Dialog(options);
  return {
    close: dialog.close.bind(dialog),
    on: dialog.on.bind(dialog),
    content: dialog.content.bind(dialog),
    footer: dialog.footer.bind(dialog),
    header: dialog.header.bind(dialog),
    options: dialog.options.bind(dialog),
    show: dialog.show.bind(dialog)
  };
}

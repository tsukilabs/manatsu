import type { StyleValue } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';

export type DialogEvent = 'hide' | 'show';

export interface DialogOptions {
  /** @default 'body' */
  appendTo?: string | HTMLElement;
  /**
   * Whether to close the dialog when clicking outside.
   * @default false
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether to close the dialog when pressing the escape key.
   * @default true
   */
  closeOnEsc?: boolean;
  contentClass?: string;
  contentStyle?: StyleValue;
  dialogClass?: string;
  dialogStyle?: StyleValue;
  draggable?: boolean;
  footerClass?: string;
  footerStyle?: StyleValue;
  /** Handle that triggers the dialog drag event. */
  handle?: Nullish<HTMLElement>;
  header?: string;
  headerClass?: string;
  headerStyle?: StyleValue;
  modal?: boolean;
  /** If set, saves the position of the dialog in the storage. */
  storageKey?: string;
  /**
   * Which storage to use when saving the position of the dialog.
   * @default 'local'
   */
  storageType?: 'local' | 'session';
}

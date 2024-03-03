import type { StyleValue } from 'vue';

export interface DialogProps {
  appendTo?: string | HTMLElement;
  /** Whether to close the dialog when clicking outside. */
  clickOutside?: boolean;
  contentClass?: string;
  contentStyle?: StyleValue;
  dialogClass?: string;
  dialogStyle?: StyleValue;
  draggable?: boolean;
  /** Whether to close the dialog when pressing the escape key. */
  esc?: boolean;
  footerClass?: string;
  footerStyle?: StyleValue;
  header?: string;
  headerClass?: string;
  headerStyle?: StyleValue;
  modal?: boolean;
  /** If set, saves the position of the dialog in the storage. */
  storageKey?: string;
  /**
   * Which storage to use when saving the position of the dialog.
   * @default 'session'
   */
  storageType?: 'local' | 'session';
}

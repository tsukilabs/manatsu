import type { StyleValue } from 'vue';

export interface DialogProps {
  appendTo?: string | HTMLElement;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  contentClass?: string;
  contentStyle?: StyleValue;
  dialogClass?: string;
  dialogStyle?: StyleValue;
  draggable?: boolean;
  footerClass?: string;
  footerStyle?: StyleValue;
  headerClass?: string;
  headerStyle?: StyleValue;
  modal?: boolean;
  /** If set, saves the position of the dialog in the storage. */
  positionStorageKey?: string;
  /**
   * Which storage to use when saving the position of the dialog.
   * @default 'session'
   */
  positionStorageType?: 'local' | 'session';
}

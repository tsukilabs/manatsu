import type { StyleValue } from 'vue';

export interface ToolbarProps {
  border?: boolean;
  centerClass?: string;
  centerStyle?: StyleValue;
  endClass?: string;
  endStyle?: StyleValue;
  startClass?: string;
  startStyle?: StyleValue;
  /**
   * HTML tag to use for the toolbar.
   * @default 'div'
   */
  tag?: string;
}

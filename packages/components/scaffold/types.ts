import type { StyleValue } from 'vue';

export interface ScaffoldProps {
  contentStyle?: StyleValue;
  /** @default '5px' */
  inset?: string | number;
  navbar?: boolean;
  navbarStyle?: StyleValue;
  style?: StyleValue;
}

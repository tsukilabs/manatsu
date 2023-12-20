import type { StyleValue, VNodeChild } from 'vue';

export interface NavbarProps {
  height?: string;
  style?: StyleValue;
  title?: string | (() => VNodeChild);
}

import type { StyleValue, VNodeChild } from 'vue';

export interface IconProps {
  ariaLabel?: string;
  height?: string | number;
  icon: () => VNodeChild;
  style?: StyleValue;
  width?: string | number;
}

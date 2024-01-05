import type { StyleValue, VNode } from 'vue';

export interface IconProps {
  ariaLabel?: string;
  height?: string | number;
  icon: () => VNode;
  style?: StyleValue;
  width?: string | number;
}

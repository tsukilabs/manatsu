import type { VNodeChild } from 'vue';

export interface IconProps {
  ariaLabel?: string;
  height?: string | number;
  icon: () => VNodeChild;
  width?: string | number;
}

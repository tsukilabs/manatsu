import type { StyleValue } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { IconProps } from '../icon';

export interface DynamicLinkProps {
  to?: RouteLocationRaw;
}

export interface IconLinkProps {
  height?: string | number;
  icon: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  style?: StyleValue;
  to: string;
  width?: string | number;
}

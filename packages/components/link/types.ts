import type { RouteLocationRaw } from 'vue-router';
import type { IconProps } from '../icon';

export interface DynamicLinkProps {
  to?: RouteLocationRaw;
}

export interface IconLinkProps {
  height?: string | number;
  icon: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  to: string;
  width?: string | number;
}

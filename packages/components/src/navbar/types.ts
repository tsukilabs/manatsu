import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { IconLinkProps } from '../link';

export interface NavbarMenuItem {
  key: string;
  label: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface NavbarProps {
  height?: string | number;
  logoStyle?: StyleValue;
  menuItems?: NavbarMenuItem[];
  menuStyle?: StyleValue;
  socialLinks?: IconLinkProps[];
  socialStyle?: StyleValue;
  style?: StyleValue;
  titleLink?: RouteLocationRaw;
  titleStyle?: StyleValue;
  width?: string | number;
}

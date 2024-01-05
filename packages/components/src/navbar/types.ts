import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface NavbarMenuItem {
  key: string;
  label: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface NavbarProps {
  contentStyle?: StyleValue;
  endStyle?: StyleValue;
  height?: string | number;
  menuItems?: NavbarMenuItem[];
  menuStyle?: StyleValue;
  startStyle?: StyleValue;
  style?: StyleValue;
  width?: string | number;
}

import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface NavbarMenuItem {
  key: string;
  label: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface NavbarProps {
  contentClass?: string;
  contentStyle?: StyleValue;
  endClass?: string;
  endStyle?: StyleValue;
  height?: string | number;
  menuClass?: string;
  menuItemClass?: string;
  menuItemStyle?: StyleValue;
  menuStyle?: StyleValue;
  startClass?: string;
  startStyle?: StyleValue;
}

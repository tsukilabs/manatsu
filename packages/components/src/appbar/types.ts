import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface TopAppbarBrandProps {
  logo?: string;
  logoClass?: string;
  logoStyle?: StyleValue;
  title?: string;
  titleClass?: string;
  titleLink?: RouteLocationRaw;
  titleLinkClass?: string;
  titleLinkStyle?: StyleValue;
  titleStyle?: StyleValue;
}

export interface TopAppbarMenuItem {
  key: string | number;
  label: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface TopAppbarProps extends TopAppbarBrandProps {
  contentAlignment?: 'start' | 'center' | 'end';
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

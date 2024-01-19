import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SidebarItem {
  key: string;
  label?: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface ScaffoldProps {
  bottomBarBorder?: string | boolean;
  bottomBarClass?: string;
  bottomBarStyle?: StyleValue;
  contentClass?: string;
  contentStyle?: StyleValue;
  defaultBorder?: string;
  sidebarClass?: string;
  sidebarItemClass?: string;
  sidebarItemStyle?: StyleValue;
  sidebarStyle?: StyleValue;
  topBarBorder?: string | boolean;
  topBarClass?: string;
  topBarStyle?: StyleValue;
}

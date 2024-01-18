import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SidebarItem {
  key: string;
  label?: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface ScaffoldProps {
  bottomBarClass?: string;
  bottomBarStyle?: StyleValue;
  contentClass?: string;
  contentStyle?: StyleValue;
  sidebarClass?: string;
  sidebarItemClass?: string;
  sidebarItemStyle?: StyleValue;
  sidebarStyle?: StyleValue;
  topBarClass?: string;
  topBarStyle?: StyleValue;
}

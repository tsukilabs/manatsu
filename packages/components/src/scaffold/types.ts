import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SidebarItem {
  key: string | number;
  label?: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface ScaffoldProps {
  bottomBorder?: string | boolean;
  bottomClass?: string;
  bottomStyle?: StyleValue;
  contentClass?: string;
  contentStyle?: StyleValue;
  defaultBorder?: string;
  sidebarClass?: string;
  sidebarItemClass?: string;
  sidebarItemStyle?: StyleValue;
  sidebarStyle?: StyleValue;
  topBorder?: string | boolean;
  topClass?: string;
  topStyle?: StyleValue;
}

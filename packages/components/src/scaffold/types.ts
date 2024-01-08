import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SidebarItem {
  key: string;
  label?: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface ScaffoldProps {
  contentClass?: string[];
  contentStyle?: StyleValue;
  footerClass?: string[];
  footerStyle?: StyleValue;
  headerClass?: string[];
  headerStyle?: StyleValue;
  sidebarClass?: string[];
  sidebarItemClass?: string[];
  sidebarItemStyle?: StyleValue;
  sidebarStyle?: StyleValue;
}

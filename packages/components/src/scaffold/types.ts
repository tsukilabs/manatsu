import type { StyleValue, VNode } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface SidebarItem {
  key: string;
  label?: string | (() => VNode);
  to?: RouteLocationRaw;
}

export interface ScaffoldProps {
  contentStyle?: StyleValue;
  footerStyle?: StyleValue;
  headerStyle?: StyleValue;
  sidebarStyle?: StyleValue;
}

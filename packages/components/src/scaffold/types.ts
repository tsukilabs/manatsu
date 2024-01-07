import type { StyleValue } from 'vue';

export interface SidebarItem {
  key: string;
}

export interface ScaffoldProps {
  contentStyle?: StyleValue;
  footerStyle?: StyleValue;
  headerStyle?: StyleValue;
  sidebarStyle?: StyleValue;
}

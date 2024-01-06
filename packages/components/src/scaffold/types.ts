import type { StyleValue } from 'vue';

export interface SidebarItem {
  key: string;
}

export interface ScaffoldProps {
  contentClass?: string[];
  contentStyle?: StyleValue;
  footerClass?: string[];
  footerStyle?: StyleValue;
  headerClass?: string[];
  headerStyle?: StyleValue;
  sidebarClass?: string[];
  sidebarItems?: SidebarItem[];
  sidebarStyle?: StyleValue;
}

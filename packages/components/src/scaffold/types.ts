import type { StyleValue } from 'vue';

export interface SidebarItem {
  key: string;
}

export interface ScaffoldProps {
  contentStyle?: StyleValue;
  headerStyle?: StyleValue;
  sidebarItemStyle?: StyleValue;
  sidebarItems?: SidebarItem[];
  sidebarStyle?: StyleValue;
  style?: StyleValue;
}

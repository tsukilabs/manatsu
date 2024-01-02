import type { StyleValue, VNodeChild } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { IconLinkProps } from '../link';

export interface NavbarLogoProps {
  logo: string | (() => VNodeChild);
}

export interface NavbarTitleProps {
  title: string | (() => VNodeChild);
}

export interface NavbarMenuItem {
  key: string;
  label: string | (() => VNodeChild);
  to?: RouteLocationRaw;
}

export type NavbarChildrenProps = Partial<NavbarLogoProps> &
  Partial<NavbarTitleProps>;

export interface NavbarProps extends NavbarChildrenProps {
  height?: string | number;
  logoStyle?: StyleValue;
  menuItems?: NavbarMenuItem[];
  menuStyle?: StyleValue;
  socialLinks?: IconLinkProps[];
  socialStyle?: StyleValue;
  style?: StyleValue;
  titleLink?: RouteLocationRaw;
  titleStyle?: StyleValue;
  width?: string | number;
}

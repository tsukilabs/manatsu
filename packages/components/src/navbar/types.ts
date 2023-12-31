import type { VNodeChild } from 'vue';
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
  to?: RouteLocationRaw;
}

export interface NavbarMenuProps {
  items: NavbarMenuItem[];
}

export type NavbarChildrenProps = Partial<NavbarLogoProps> &
  Partial<NavbarTitleProps> &
  Partial<NavbarMenuProps>;

export interface NavbarProps extends NavbarChildrenProps {
  socialLinks?: IconLinkProps[];
  titleLink?: RouteLocationRaw;
}

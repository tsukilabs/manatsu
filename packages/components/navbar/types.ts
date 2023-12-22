import type { VNodeChild } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { SocialLinkProps } from '..';

export interface NavbarLogoProps {
  logo: string | (() => VNodeChild);
}

export interface NavbarTitleProps {
  title: string | (() => VNodeChild);
}

export interface NavbarMenuItem {
  to?: RouteLocationRaw;
}

export interface NavbarMenuProps {
  menu?: NavbarMenuItem[];
}

export interface NavbarProps
  extends Partial<NavbarLogoProps>,
    Partial<NavbarTitleProps>,
    Partial<NavbarMenuProps> {
  socialLinks?: SocialLinkProps[];
  titleLink?: RouteLocationRaw;
}

import type { VNodeChild } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { SocialLinkProps } from '..';

export interface NavbarLogoProps {
  logo: string | (() => VNodeChild);
}

export interface NavbarTitleProps {
  title: string | (() => VNodeChild);
}

export interface NavbarProps
  extends Partial<NavbarLogoProps>,
    Partial<NavbarTitleProps> {
  socialLinks?: SocialLinkProps[];
  titleLink?: RouteLocationRaw;
}

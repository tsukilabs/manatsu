import type { VNodeChild } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { SocialIcon } from '../icon';

export interface DynamicLinkProps {
  to?: RouteLocationRaw;
}

export interface SocialLinkProps {
  icon: SocialIcon | (() => VNodeChild);
  to: string;
}

import type { VNodeChild } from 'vue';

export type SocialIcon =
  | 'discord'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'mastodon'
  | 'slack'
  | 'twitter'
  | 'x'
  | 'youtube';

/** @see https://simpleicons.org/ */
export type BuiltInIcon = SocialIcon;

export interface IconProps {
  ariaLabel?: string;
  height?: string | number;
  icon: BuiltInIcon | (() => VNodeChild);
  width?: string | number;
}

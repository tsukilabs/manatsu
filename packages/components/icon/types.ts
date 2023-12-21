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
export type SimpleIcon = SocialIcon;

export interface IconProps {
  ariaLabel?: string;
  icon?: SimpleIcon;
  svg?: string;
}

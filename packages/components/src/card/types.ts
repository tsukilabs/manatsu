import type { StyleValue } from 'vue';
import type { MaybePromise, Nullish } from '@tb-dev/utility-types';
import type { ButtonProps } from '../button';

export type CardVariant = 'filled' | 'elevated' | 'outlined';

export interface CardHeaderProps {
  headerClass?: string;
  headerEndClass?: string;
  headerEndStyle?: StyleValue;
  headerStartClass?: string;
  headerStartStyle?: StyleValue;
  headerStyle?: StyleValue;
  subtitle?: Nullish<string>;
  subtitleClass?: string;
  subtitleStyle?: StyleValue;
  title?: Nullish<string>;
  titleClass?: string;
  titleStyle?: StyleValue;
}

export interface CardAction extends ButtonProps {
  key: string;
  onClick?: () => MaybePromise<void>;
}

export interface CardFooterProps {
  actions?: CardAction[];
  footerClass?: string;
  footerStyle?: StyleValue;
}

export interface CardProps extends CardHeaderProps, CardFooterProps {
  contentClass?: string;
  contentStyle?: StyleValue;
  mediaClass?: string;
  /**
   * Whether the media should be placed before or after the header.
   * @default 'after'
   */
  mediaPosition?: 'before' | 'after';
  mediaStyle?: StyleValue;
  variant?: CardVariant;
}

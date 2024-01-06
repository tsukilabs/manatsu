import type { StyleValue } from 'vue';

export type ButtonVariant = 'filled' | 'outlined';

export interface ButtonProps {
  buttonClass?: string[];
  style?: StyleValue;
  variant?: ButtonVariant;
}

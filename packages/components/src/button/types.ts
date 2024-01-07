import type { StyleValue } from 'vue';

export type ButtonVariant = 'filled' | 'outlined';

export interface ButtonProps {
  style?: StyleValue;
  variant?: ButtonVariant;
}

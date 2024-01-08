import type { StyleValue } from 'vue';

export type ButtonVariant = 'filled' | 'outlined';

export interface ButtonProps {
  buttonClass?: string;
  buttonStyle?: StyleValue;
  variant?: ButtonVariant;
}

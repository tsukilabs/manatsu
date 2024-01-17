export type ButtonVariant = 'filled' | 'elevated' | 'outlined';

export interface ButtonProps {
  disabled?: boolean;
  label?: string;
  variant?: ButtonVariant;
}

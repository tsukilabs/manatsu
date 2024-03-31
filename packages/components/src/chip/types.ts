export type ChipVariant = 'filled' | 'elevated' | 'outlined';

export interface ChipProps {
  label?: string;
  removable?: boolean;
  variant?: ChipVariant;
}

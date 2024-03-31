export type ChipVariant = 'elevated' | 'outlined';

export interface ChipProps {
  label?: string;
  removable?: boolean;
  variant?: ChipVariant;
}

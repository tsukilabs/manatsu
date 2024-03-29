import type { StyleValue } from 'vue';

export interface SelectProps {
  ariaLabel?: string;
  disabled?: boolean;
  dropdownClass?: string;
  dropdownStyle?: StyleValue;
  multiple?: boolean;
  options?: SelectOption[];
  optionsClass?: string;
  optionsStyle?: StyleValue;
  placeholder?: string;
}

export interface SelectOption<T = any> {
  key: string;
  value: T;
}

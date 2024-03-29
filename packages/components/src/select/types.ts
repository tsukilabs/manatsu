import type { StyleValue } from 'vue';

export interface SelectProps {
  ariaLabel?: string;
  disabled?: boolean;
  dropdownClass?: string;
  dropdownStyle?: StyleValue;
  /** @default true */
  hideOnWindowBlur?: boolean;
  labelClass?: string;
  labelStyle?: StyleValue;
  multiple?: boolean;
  options?: SelectOption[];
  optionsClass?: string;
  optionsStyle?: StyleValue;
  placeholder?: string;
  /** Transform the value of each option to a string. */
  transform?: (value: any) => string;
}

export interface SelectOption<T = any> {
  key: string | number;
  value: T;
}

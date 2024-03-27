import type { StyleValue } from 'vue';

export interface CheckboxProps {
  disabled?: boolean;
  falseValue?: any;
  inputClass?: string;
  inputId?: string;
  inputStyle?: StyleValue;
  label?: string;
  trueValue?: any;
  value?: any;
}

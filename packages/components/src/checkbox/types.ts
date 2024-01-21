import type { InputHTMLAttributes, StyleValue } from 'vue';

export interface CheckboxProps {
  disabled?: boolean;
  falseValue?: InputHTMLAttributes['value'];
  inputClass?: string;
  inputId?: string;
  inputStyle?: StyleValue;
  label?: string;
  trueValue?: InputHTMLAttributes['value'];
  value?: InputHTMLAttributes['value'];
}

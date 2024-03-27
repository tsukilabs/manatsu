import type { StyleValue } from 'vue';

export interface RadioProps {
  disabled?: boolean;
  inputClass?: string;
  inputId?: string;
  inputStyle?: StyleValue;
  label?: string;
  name?: string;
  value?: any;
}

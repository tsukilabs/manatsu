import type { StyleValue } from 'vue';

export interface RadioProps<Value> {
  disabled?: boolean;
  inputClass?: string;
  inputId?: string;
  inputStyle?: StyleValue;
  label?: string;
  name?: string;
  value?: Value;
}

import type { CSSProperties } from 'vue';

export interface ButtonProps {
  elevated?: boolean;
  filled?: boolean;
  outlined?: boolean;
  style?: CSSProperties;
  text?: boolean;
  tonal?: boolean;
}

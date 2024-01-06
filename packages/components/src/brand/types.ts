import type { StyleValue } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface BrandProps {
  linkStyle?: StyleValue;
  logoClass?: string[];
  logoStyle?: StyleValue;
  style?: StyleValue;
  titleClass?: string[];
  titleLink?: RouteLocationRaw;
  titleStyle?: StyleValue;
}

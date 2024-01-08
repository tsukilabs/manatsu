import type { StyleValue } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface BrandProps {
  linkClass?: string[];
  linkStyle?: StyleValue;
  logoClass?: string[];
  logoStyle?: StyleValue;
  titleClass?: string[];
  titleLink?: RouteLocationRaw;
  titleStyle?: StyleValue;
}

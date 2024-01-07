import type { StyleValue } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface BrandProps {
  linkStyle?: StyleValue;
  logoStyle?: StyleValue;
  style?: StyleValue;
  titleLink?: RouteLocationRaw;
  titleStyle?: StyleValue;
}

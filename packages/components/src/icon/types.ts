import type { Component, StyleValue } from 'vue';

export interface IconProps {
  ariaLabel?: string;
  component?: Component;
  height?: string | number;
  style?: StyleValue;
  width?: string | number;
}

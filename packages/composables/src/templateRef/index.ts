import { type Component, ref } from 'vue';

export function templateRef<T extends HTMLElement | Component>() {
  return ref<T | null>(null);
}

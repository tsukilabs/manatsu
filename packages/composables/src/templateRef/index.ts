import { type Component, type Ref, ref } from 'vue';

export function templateRef<T extends HTMLElement | Component>(): Ref<T | null> {
  return ref(null);
}

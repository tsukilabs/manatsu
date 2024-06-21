import { type ComponentPublicInstance, type Ref, ref } from 'vue';

export function templateRef<T extends HTMLElement>(): Ref<T | null> {
  return ref(null);
}

export function componentRef<T extends ComponentPublicInstance>(): Ref<T | null> {
  return ref(null);
}

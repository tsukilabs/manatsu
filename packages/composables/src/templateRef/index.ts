import { type Ref, ref } from 'vue';

export function templateRef<T extends HTMLElement>(): Ref<T | null> {
  return ref(null);
}

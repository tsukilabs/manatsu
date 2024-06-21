import type { Ref } from 'vue';
import { useWindowSize } from '@vueuse/core';

export function useWindowHeight() {
  return useWindowSize().height as Readonly<Ref<number>>;
}

export function useWindowWidth() {
  return useWindowSize().width as Readonly<Ref<number>>;
}

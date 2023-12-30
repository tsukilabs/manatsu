<script setup lang="ts">
import type { InputProps } from './types';

defineProps<InputProps>();

const value = defineModel<string | null>('value');
</script>

<template>
  <div class="m-input-wrapper" role="none">
    <input
      v-model="value"
      type="text"
      class="m-input"
      :style="style"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped lang="scss">
:global(:root) {
  --m-input-padding: 0.4em;
}

.m-input {
  outline: none;
  border: 1px solid var(--m-color-outline);
  border-radius: var(--m-border-radius);
  background-color: transparent;
  padding: var(--m-input-padding);
  color: inherit;
  caret-color: var(--m-color-primary);
  font-family: inherit;

  &:hover,
  &:active,
  &:focus {
    border-color: var(--m-color-primary);
  }
}
</style>

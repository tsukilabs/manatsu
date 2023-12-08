<script setup lang="ts">
import type { InputProps } from './types';

defineProps<InputProps>();
</script>

<template>
  <div class="m-input-wrapper" role="none">
    <input
      type="text"
      class="m-input"
      :style="style"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped lang="scss">
:global(:root) {
  --mana-input-padding: 0.4em;
}

.m-input {
  outline: none;
  border: 1px solid var(--mana-color-outline);
  border-radius: var(--mana-border-radius);
  background-color: transparent;
  padding: var(--mana-input-padding);
  color: inherit;
  caret-color: var(--mana-color-primary);
  font-family: inherit;

  &:hover,
  &:active,
  &:focus {
    border-color: var(--mana-color-primary);
  }
}
</style>

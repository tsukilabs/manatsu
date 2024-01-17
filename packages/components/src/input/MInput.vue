<script setup lang="ts">
import type { InputProps } from './types';

defineProps<InputProps>();

const value = defineModel<string | null>('value');
</script>

<template>
  <div role="none">
    <input
      v-model="value"
      type="text"
      class="m-input"
      :class="inputClass"
      :style="inputStyle"
      :placeholder="placeholder"
    />
  </div>
</template>

<style lang="scss">
.m-input {
  outline: none;
  border: 1px solid var(--m-color-outline);
  border-radius: var(--m-border-radius);
  background-color: transparent;
  padding: 0.4em;
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

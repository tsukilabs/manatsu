<script setup lang="ts">
import type { InputTextProps } from './types';

const value = defineModel<string | null>('value');

defineProps<InputTextProps>();
</script>

<template>
  <input v-model="value" type="text" class="m-input" :placeholder="placeholder" />
</template>

<style lang="scss">
.m-input {
  cursor: initial;
  outline: none;
  border: 1px solid var(--m-color-outline);
  border-radius: var(--m-border-radius);
  background-color: transparent;
  padding: 0.4em;
  color: inherit;
  caret-color: var(--m-color-primary);
  font-family: inherit;

  &:hover,
  &:focus {
    border-color: var(--m-color-primary);
  }
}
</style>

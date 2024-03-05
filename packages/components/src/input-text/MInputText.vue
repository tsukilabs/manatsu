<script setup lang="ts">
import type { InputTextProps } from './types';

const model = defineModel<string | null>();

defineProps<InputTextProps>();
</script>

<template>
  <input v-model="model" type="text" class="m-input" :placeholder />
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

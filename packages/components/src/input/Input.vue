<script setup lang="ts">
import type { InputProps } from './types';

defineProps<InputProps>();

defineOptions({ name: 'MInput' });

const value = defineModel<string | null>();
</script>

<template>
  <div role="none">
    <input v-model="value" type="text" class="m-input" :style="style" :placeholder="placeholder" />
  </div>
</template>

<style scoped lang="scss">
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

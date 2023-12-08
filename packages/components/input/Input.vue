<script setup lang="ts">
import type { InputProps } from './types';

defineProps<InputProps>();
</script>

<template>
  <div role="none">
    <input type="text" class="m-input" :style="style" placeholder="teste" />
  </div>
</template>

<style scoped lang="scss">
.m-input {
  border: 1px solid var(--mana-color-outline);
  border-radius: var(--mana-border-radius);
  background-color: transparent;
  color: inherit;
  caret-color: var(--mana-color-primary);
  font-family: inherit;
}
</style>

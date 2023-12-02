<script setup lang="ts">
import { computed } from 'vue';
import type { InputProps } from './types';

const props = defineProps<InputProps>();

const classList = computed(() => {
  return {
    'm-input-filled': props.filled,
    'm-input-outlined': props.outlined
  };
});
</script>

<template>
  <div role="none">
    <input type="text" class="m-input" :class="classList" :style="style" />
  </div>
</template>

<style scoped lang="scss">
.m-input {
  border: 1px solid var(--mana-color-outline);
  border-radius: var(--mana-border-radius);
  color: inherit;
  caret-color: var(--mana-color-primary);
  font-family: inherit;
}

.m-input-filled {
  background-color: var(--mana-color-tertiary-container);
}

.m-input-outlined {
  background-color: transparent;
}
</style>

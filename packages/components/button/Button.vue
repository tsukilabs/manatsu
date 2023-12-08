<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from './types';

const props = defineProps<ButtonProps>();

const classList = computed(() => ({
  'm-button-outlined': props.outlined
}));
</script>

<template>
  <div class="m-button-wrapper" role="none">
    <button type="button" class="m-button" :class="classList" :style="style">
      <span class="m-button-content">
        <slot></slot>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
:global(:root) {
  --mana-button-min-height: 32px;
  --mana-button-min-width: 10ch;
  --mana-button-padding: 0.25em 0.75em;
}

.m-button-wrapper {
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  max-width: max-content;
  white-space: nowrap;
}

.m-button {
  cursor: pointer;
  border: none;
  border-radius: var(--mana-border-radius);
  padding: var(--mana-button-padding);
  min-width: var(--mana-button-min-width);
  min-height: var(--mana-button-min-height);
  font-weight: var(--mana-tp-label-large-font-weight);
  font-size: var(--mana-tp-label-large-font-size);
  line-height: var(--mana-tp-label-large-line-height);
  font-family: inherit;
  text-align: center;
}

.m-button:not(.m-button-outlined) {
  transition: filter 0.3s ease-in-out;
  background-color: var(--mana-color-primary);
  color: var(--mana-color-on-primary);

  &:hover {
    filter: contrast(150%);
  }
}

.m-button-outlined {
  transition:
    color 0.3s ease-in-out,
    border-color 0.3s ease-in-out;
  border: 1px solid var(--mana-color-outline);
  background-color: transparent;
  color: inherit;

  &:hover {
    border-color: var(--mana-color-primary);
    color: var(--mana-color-primary);
  }
}
</style>

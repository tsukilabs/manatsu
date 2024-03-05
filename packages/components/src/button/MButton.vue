<script setup lang="ts">
import { type VNode, computed } from 'vue';
import type { ButtonProps } from './types';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'filled'
});

defineSlots<{ default?: () => VNode }>();

const classList = computed(() => {
  return ['m-button', `m-button-${props.variant}`];
});
</script>

<template>
  <button type="button" :class="classList" :disabled>
    <slot>{{ label }}</slot>
  </button>
</template>

<style lang="scss">
.m-button {
  border: none;
  border-radius: var(--m-border-radius);
  padding: 0.25em 0.75em;
  min-width: 10ch;
  min-height: 32px;
  font-weight: 500;
  font-size: 1rem;
  font-family: inherit;
  text-align: center;

  &:disabled {
    opacity: 0.5;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &-filled {
    transition: box-shadow 0.2s ease-in-out;
    background-color: var(--m-color-primary);
    color: var(--m-color-on-primary);

    &:hover:not(:disabled) {
      box-shadow: 0 0 1px 1px rgb(0 0 0 / 30%);
    }
  }

  &-elevated {
    transition:
      box-shadow 0.2s ease-in-out,
      color 0.2s ease-in-out;
    box-shadow: 0 0 1px 1px rgb(0 0 0 / 15%);
    background-color: var(--m-color-surface-container-low);
    color: var(--m-color-primary);

    &:hover:not(:disabled) {
      box-shadow: 0 0 1px 1px rgb(0 0 0 / 30%);
    }
  }

  &-outlined {
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out,
      color 0.2s ease-in-out;
    border: 1px solid var(--m-color-outline);
    background-color: transparent;
    color: inherit;

    &:hover:not(:disabled) {
      box-shadow: 0 0 1px 1px rgb(0 0 0 / 15%);
      border-color: var(--m-color-primary);
      color: var(--m-color-primary);
    }
  }
}
</style>

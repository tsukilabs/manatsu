<script setup lang="ts">
import type { VNode } from 'vue';
import type { CheckboxProps } from './types';

defineProps<CheckboxProps>();

defineSlots<{ default?: () => VNode }>();
</script>

<template>
  <div class="m-checkbox">
    <input type="checkbox" :disabled="disabled" :class="inputClass" :style="inputStyle" />
    <label v-if="label || $slots.default" :class="labelClass" :style="labelStyle">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-checkbox {
  @include flex.y-center($inline: true);

  &:has(> label) {
    gap: 0.5em;
  }

  & > input[type='checkbox'] {
    @include flex.center($inline: true);
    appearance: none;
    border: 1px solid var(--m-color-on-surface-variant);
    border-radius: var(--m-border-radius);
    width: 1.15em;
    height: 1.15em;
    font: inherit;
  }

  & > input[type='checkbox']:hover:not(:disabled) {
    box-shadow: 0 0 1px 1px rgb(0 0 0 / 15%);
    border-color: var(--m-color-primary);
  }

  & > input[type='checkbox']::before {
    scale: 0;
    transition: scale 0.1s ease-in-out;
    background-color: var(--m-color-primary);
    width: 0.65em;
    height: 0.65em;
    content: '';
  }

  & > input[type='checkbox']:checked::before {
    scale: 1;
  }
}
</style>

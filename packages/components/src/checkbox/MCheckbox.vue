<script setup lang="ts">
import type { VNode } from 'vue';
import type { CheckboxProps } from './types';

defineProps<CheckboxProps>();

defineSlots<{ default?: () => VNode }>();

const checked = defineModel<boolean>('checked');
</script>

<template>
  <label class="m-checkbox">
    <input
      v-model="checked"
      type="checkbox"
      :disabled="disabled"
      :class="inputClass"
      :style="inputStyle"
    />
    <span v-if="label || $slots.default" class="m-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-checkbox {
  @include flex.y-center($inline: true);

  &:has(&-label) {
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
    clip-path: polygon(17% 54%, 28% 43%, 38% 54%, 70% 22%, 81% 33%, 38% 75%, 17% 54%);
    transition: scale 0.1s ease-in-out;
    background-color: var(--m-color-primary);
    width: inherit;
    height: inherit;
    content: '';
  }

  & > input[type='checkbox']:checked::before {
    scale: 1;
  }

  & > input[type='checkbox']:disabled::before {
    opacity: 0.5;
    background-color: var(--m-color-on-surface);
  }
}
</style>

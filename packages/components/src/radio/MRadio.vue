<script setup lang="ts" generic="Value">
import type { VNode } from 'vue';
import type { RadioProps } from './types';

const model = defineModel<Value>();

defineProps<RadioProps<Value>>();

defineSlots<{ default?: () => VNode }>();
</script>

<template>
  <label class="m-radio">
    <input
      :id="inputId"
      v-model="model"
      type="radio"
      :class="inputClass"
      :style="inputStyle"
      :disabled="disabled"
      :name="name"
      :value="value"
    />

    <span v-if="label || $slots.default" class="m-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style lang="scss">
@use '@manatsu/sass/flex';

.m-radio {
  @include flex.y-center($inline: true);

  &:has(&-label) {
    gap: 0.5em;
  }

  & > input[type='radio'] {
    @include flex.center($inline: true);
    appearance: none;
    border: 1px solid var(--m-color-on-surface-variant);
    border-radius: 50%;
    width: 1.1em;
    height: 1.1em;
    font-size: inherit;
  }

  & > input[type='radio']:hover:not(:disabled) {
    box-shadow: 0 0 1px 1px rgb(0 0 0 / 15%);
    border-color: var(--m-color-primary);
  }

  & > input[type='radio']::before {
    scale: 0;
    transition: scale 0.1s ease-in-out;
    border-radius: 50%;
    background-color: var(--m-color-primary);
    width: 80%;
    height: 80%;
    content: '';
  }

  & > input[type='radio']:checked::before {
    scale: 1;
  }

  & > input[type='radio']:disabled::before {
    opacity: 0.5;
    background-color: var(--m-color-on-surface);
  }
}
</style>

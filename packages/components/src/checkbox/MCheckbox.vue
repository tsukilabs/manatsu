<script setup lang="ts" generic="Model">
import type { VNode } from 'vue';
import type { CheckboxProps } from './types';

const model = defineModel<Model>();

withDefaults(defineProps<CheckboxProps>(), {
  trueValue: true,
  falseValue: false
});

defineSlots<{ default?: () => VNode }>();
</script>

<template>
  <label class="m-checkbox">
    <input
      :id="inputId"
      v-model="model"
      type="checkbox"
      :class="inputClass"
      :style="inputStyle"
      :disabled
      :value
      :true-value
      :false-value
    />
    <span v-if="label || $slots.default" class="m-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style lang="scss">
@use '@manatsu/style/mixins/flex';

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
    width: 1.1em;
    height: 1.1em;
    font-size: inherit;
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
    width: 100%;
    height: 100%;
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

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
@use '@manatsu/style/mixins/shadow';
@use '@manatsu/style/mixins/transition';
@use '@manatsu/style/mixins/utils';

.m-button {
  border: none;
  border-radius: var(--m-border-radius);
  padding: 0.4rem 0.75rem;
  min-width: 10ch;
  min-height: 32px;
  font-weight: 500;
  font-size: 1rem;
  font-family: inherit;
  text-align: center;

  &:disabled {
    opacity: 0.5;
  }

  @include utils.active {
    transform: translateY(1px);
  }

  &-filled {
    @include transition.ease-in-out(box-shadow, 0.2s);
    background-color: var(--m-color-primary);
    color: var(--m-color-on-primary);

    @include utils.hover {
      @include shadow.box-30;
    }
  }

  &-elevated {
    @include shadow.box-15;
    @include transition.ease-in-out(box-shadow color, 0.2s);
    background-color: var(--m-color-surface-container-low);
    color: var(--m-color-primary);

    @include utils.hover {
      @include shadow.box-30;
    }
  }

  &-outlined {
    @include transition.ease-in-out(border-color box-shadow color, 0.2s);
    border: 1px solid var(--m-color-outline);
    background-color: transparent;
    color: inherit;

    @include utils.hover {
      @include shadow.box-15;
      border-color: var(--m-color-primary);
      color: var(--m-color-primary);
    }
  }
}
</style>

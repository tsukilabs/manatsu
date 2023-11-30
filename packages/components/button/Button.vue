<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  readonly type?: 'filled' | 'tonal';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'filled'
});

const color = computed(() => {
  switch (props.type) {
    case 'filled':
      return 'var(--mana-color-on-primary)';
    case 'tonal':
      return 'var(--mana-color-on-secondary-container)';
    default:
      return 'var(--mana-color-on-primary)';
  }
});

const bgColor = computed(() => {
  switch (props.type) {
    case 'filled':
      return 'var(--mana-color-primary)';
    case 'tonal':
      return 'var(--mana-color-secondary-container)';
    default:
      return 'var(--mana-color-primary)';
  }
});
</script>

<template>
  <div class="m-button" role="none">
    <button type="button">
      <span class="m-button-content">
        <slot></slot>
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.m-button {
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  max-width: max-content;
  white-space: nowrap;

  button {
    cursor: pointer;
    border: none;
    border-radius: var(--mana-button-border-radius);
    background-color: v-bind('bgColor');
    padding: var(--mana-button-padding);
    min-width: var(--mana-button-min-width);
    min-height: var(--mana-button-height);
    color: v-bind('color');
    line-height: var(--mana-button-line-height);
    font-family: inherit;
    text-align: center;

    transition: {
      property: filter;
      duration: 200ms;
      timing-function: ease-in-out;
    }

    &:hover,
    &:active {
      filter: contrast(150%);
    }
  }
}
</style>

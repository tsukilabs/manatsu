<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from './types';

const props = defineProps<ButtonProps>();

const classList = computed(() => ({
  'm-button-filled': !props.outlined,
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
@use '@manatsu/sass/flex';

.m-button-wrapper {
  @include flex.center($inline: true);
  flex-wrap: nowrap;
  max-width: max-content;
  white-space: nowrap;
}

.m-button {
  cursor: pointer;
  border: none;
  border-radius: var(--m-border-radius);
  padding: 0.25em 0.75em;
  min-width: 10ch;
  min-height: 32px;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
}

.m-button-filled {
  transition: filter 0.3s ease-in-out;
  background-color: var(--m-color-primary);
  color: var(--m-color-on-primary);

  &:hover {
    filter: contrast(150%);
  }
}

.m-button-outlined {
  transition: border-color 0.3s ease-in-out;
  border: 1px solid var(--m-color-outline);
  background-color: transparent;
  color: inherit;

  &:hover {
    border-color: var(--m-color-primary);
    color: var(--m-color-primary);
  }
}
</style>

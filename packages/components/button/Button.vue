<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from './types';

const props = defineProps<ButtonProps>();

const classList = computed(() => {
  const classes = {
    'm-button-elevated': props.elevated,
    'm-button-filled': props.filled,
    'm-button-outlined': props.outlined,
    'm-button-text': props.text,
    'm-button-tonal': props.tonal
  };

  if (Object.values(classes).every((c) => !c)) {
    classes['m-button-filled'] = true;
  }

  return classes;
});
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
  --mana-button-line-height: 1.1;
  --mana-button-min-height: 34px;
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
  line-height: var(--mana-button-line-height);
  font-family: inherit;
  text-align: center;

  transition: {
    property: filter;
    duration: 200ms;
    timing-function: ease-in-out;
  }

  &:hover {
    filter: contrast(150%);
  }
}

.m-button-elevated {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
  background-color: var(--mana-color-surface-low);
  color: var(--mana-color-primary);
}

.m-button-filled {
  background-color: var(--mana-color-primary);
  color: var(--mana-color-on-primary);
}

.m-button-outlined {
  border: 1px solid var(--mana-color-outline);
  background-color: transparent;
  color: var(--mana-color-primary);
}

.m-button-text {
  background-color: transparent;
  color: var(--mana-color-primary);
}

.m-button-tonal {
  background-color: var(--mana-color-secondary-container);
  color: var(--mana-color-on-secondary-container);
}
</style>

<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<script setup lang="ts">
import { computed } from 'vue';
import FilledButton from './FilledButton.vue';

interface Props {
  readonly type?: 'filled';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'filled'
});

const button = computed(() => {
  switch (props.type) {
    case 'filled':
      return FilledButton;
    default:
      return FilledButton;
  }
});
</script>

<template>
  <div class="m-button" role="none">
    <component :is="button">
      <slot></slot>
    </component>
  </div>
</template>

<style lang="scss">
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
    background-color: transparent;
    padding: var(--mana-button-padding);
    color: inherit;
    font-family: inherit;
    text-align: center;
  }
}
</style>

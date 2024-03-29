<script setup lang="ts">
import type { InputTextProps } from './types';

const model = defineModel<string | null>();

defineProps<InputTextProps>();
</script>

<template>
  <input v-model="model" type="text" class="m-input-text" :disabled :placeholder />
</template>

<style lang="scss">
@use '@manatsu/style/mixins/shadow';
@use '@manatsu/style/mixins/transition';
@use '@manatsu/style/mixins/utils';

.m-input-text {
  @include transition.ease-in-out(border-color box-shadow, 0.2s);
  outline: none;
  border: 1px solid var(--m-color-outline);
  border-radius: var(--m-border-radius);
  background-color: var(--m-color-surface-container-lowest);
  padding: 0.4em;
  color: inherit;
  caret-color: var(--m-color-primary);
  font-size: 1rem;
  font-family: inherit;

  @include utils.focus-hover {
    @include shadow.box-15;
    border-color: var(--m-color-primary);
  }
}
</style>

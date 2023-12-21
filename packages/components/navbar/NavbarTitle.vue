<script setup lang="ts">
import { defineComponent, h } from 'vue';
import type { NavbarTitleProps } from './types';

const props = defineProps<NavbarTitleProps>();

const TitleText = defineComponent(() => {
  return () => {
    if (typeof props.title === 'function') {
      return props.title;
    }

    return h('span', props.title);
  };
});
</script>

<template>
  <TitleText class="m-navbar-title" />
</template>

<style scoped lang="scss">
:global(:root) {
  --m-navbar-title-font-size: 1.5rem;
  --m-navbar-title-font-weight: 600;
}

.m-navbar-title {
  font-weight: var(--m-navbar-title-font-weight);
  font-size: var(--m-navbar-title-font-size);
}
</style>

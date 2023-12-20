<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { useToPixel } from '@manatsu/composables/index.ts';
import type { NavbarProps } from './types';

const props = withDefaults(defineProps<NavbarProps>(), {
  height: '60px'
});

const heightRef = useToPixel(() => props.height);

const NavbarTitle = defineComponent(() => {
  if (typeof props.title === 'string') {
    return () => h('span', props.title);
  }
  return props.title;
});
</script>

<template>
  <header class="m-navbar" :style="style">
    <NavbarTitle v-if="title" class="m-navbar-title" />
  </header>
</template>

<style scoped lang="scss">
.m-navbar {
  display: flex;
  align-items: center;
  width: 100%;
  height: v-bind('heightRef');
}

.m-navbar-title {
  font-weight: var(--m-tp-headline-medium-font-weight);
  font-size: var(--m-tp-headline-medium-font-size);
  line-height: var(--m-tp-headline-medium-line-height);
}
</style>

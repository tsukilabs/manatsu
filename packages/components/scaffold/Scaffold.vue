<script setup lang="ts">
import { useToPixel } from '@manatsu/composables/index.ts';
import type { ScaffoldProps } from './types';

const props = withDefaults(defineProps<ScaffoldProps>(), {
  inset: '5px'
});

const insetRef = useToPixel(() => props.inset);
</script>

<template>
  <div class="m-scaffold" :style="style">
    <div v-if="navbar" :style="navbarStyle">
      <slot name="navbar"></slot>
    </div>

    <div class="m-scaffold-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.m-scaffold {
  display: flex;
  position: absolute;
  flex-direction: column;
  inset: v-bind('insetRef');
  overflow: hidden;
}

.m-scaffold-content {
  width: 100%;
  height: 100%;
}
</style>

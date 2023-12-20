<script setup lang="ts">
import type { ScaffoldProps } from './types';

defineProps<ScaffoldProps>();
</script>

<template>
  <div class="m-scaffold" :style="style">
    <div v-if="navbar" :style="navbarStyle">
      <slot name="navbar"></slot>
    </div>

    <div class="m-scaffold-main">
      <div class="m-scaffold-content" :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:global(:root) {
  --m-scaffold-content-padding: 1rem;
}

.m-scaffold {
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 100vh;
  overflow: hidden;
}

.m-scaffold-main {
  width: 100%;
  height: 100%;
}

.m-scaffold-content {
  padding: var(--m-scaffold-content-padding);
  width: 100%;
  height: 100%;
}
</style>

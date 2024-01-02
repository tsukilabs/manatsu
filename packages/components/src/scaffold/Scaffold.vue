<script setup lang="ts">
import type { ScaffoldProps } from './types';

defineProps<ScaffoldProps>();
</script>

<template>
  <div class="m-scaffold" :style="style">
    <div v-if="$slots.header" class="m-scaffold-header" :style="headerStyle">
      <slot name="header"></slot>
    </div>

    <div class="m-scaffold-main">
      <div class="m-scaffold-content" :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.m-scaffold {
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 100vh;
  overflow: hidden;
}

.m-scaffold-main {
  flex: 1 1 auto;
}

.m-scaffold-content {
  padding: 1rem;
}
</style>

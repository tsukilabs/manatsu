<script setup lang="ts">
import type { VNode } from 'vue';
import type { BrandProps } from './types';
import MDynamicLink from '../link/MDynamicLink.vue';

defineProps<BrandProps>();

defineSlots<{
  logo?: () => VNode;
  title?: () => VNode;
}>();
</script>

<template>
  <div class="m-brand" :style="style">
    <MDynamicLink :to="titleLink" :style="linkStyle">
      <div v-if="$slots.logo" class="m-brand-logo" :style="logoStyle">
        <slot name="logo"></slot>
      </div>

      <div v-if="$slots.title" class="m-brand-title" :style="titleStyle">
        <slot name="title"></slot>
      </div>
    </MDynamicLink>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-brand {
  @include flex.y-center;

  /** Make the dynamic-link flex. */
  & > :first-child {
    @include flex.y-center;
  }

  @each $name in (logo, title) {
    .m-brand-#{$name} {
      @include flex.y-center;
    }
  }

  .m-brand-logo {
    margin: 0 8px 0 0;
  }

  .m-brand-title {
    font-weight: 600;
    font-size: 1.5rem;
  }
}
</style>

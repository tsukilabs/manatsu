<script setup lang="ts">
import type { VNode } from 'vue';
import { useToPixel } from '@manatsu/composables/src/index.ts';
import type { NavbarMenuItem, NavbarProps } from './types';

const props = withDefaults(defineProps<NavbarProps>(), {
  height: '60px',
  width: '100%'
});

defineSlots<{
  end?: () => VNode;
  item?: (props: NavbarMenuItem) => VNode;
  start?: () => VNode;
}>();

const height = useToPixel(() => props.height);
const width = useToPixel(() => props.width);
</script>

<template>
  <header class="m-navbar" :style="style">
    <div v-if="$slots.start" class="m-navbar-start" :style="startStyle">
      <slot name="start"></slot>
    </div>

    <div class="m-navbar-content" :style="contentStyle">
      <nav
        v-if="menuItems && menuItems.length > 0"
        class="m-navbar-menu"
        :style="menuStyle"
      >
        <div
          v-for="item of menuItems"
          :key="item.key"
          class="m-navbar-menu-item"
        >
          <slot name="item" v-bind="item"></slot>
        </div>
      </nav>

      <div v-if="$slots.end" class="m-navbar-end" :style="endStyle">
        <slot name="end"></slot>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-navbar {
  @include flex.x-between-y-center;
  padding: 0 1rem;
  width: v-bind('width');
  height: v-bind('height');
  user-select: none;
  white-space: nowrap;

  @each $name in (start, menu, end) {
    .m-navbar-#{$name} {
      @include flex.y-center;
    }
  }
}

.m-navbar-content {
  @include flex.x-end;
  flex: 1 1 auto;
  gap: 1.5rem;

  .m-navbar-menu {
    @include flex.y-center;
    gap: 1.5rem;
  }
}
</style>

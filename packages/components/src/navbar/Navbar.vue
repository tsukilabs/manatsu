<script setup lang="ts">
import { type VNode, shallowRef } from 'vue';
import { usePixelWidth, useToPixel } from '@manatsu/composables/src/index.ts';
import type { NavbarMenuItem, NavbarProps } from './types';

const props = withDefaults(defineProps<NavbarProps>(), {
  height: '60px'
});

defineOptions({ name: 'MNavbar' });

defineSlots<{
  end?: () => VNode;
  'menu-item'?: (props: NavbarMenuItem) => VNode;
  start?: () => VNode;
}>();

const height = useToPixel(() => props.height);

const start = shallowRef<HTMLElement | null>(null);
const startWidth = usePixelWidth(start);

const end = shallowRef<HTMLElement | null>(null);
const endWidth = usePixelWidth(end);

defineExpose({ startWidth, endWidth });
</script>

<template>
  <header class="m-navbar">
    <div
      v-if="$slots.start"
      ref="start"
      class="m-navbar-start"
      :class="startClass"
      :style="startStyle"
    >
      <slot name="start"></slot>
    </div>

    <div class="m-navbar-content" :class="contentClass" :style="contentStyle">
      <nav
        v-if="menuItems && menuItems.length > 0"
        class="m-navbar-menu"
        :class="menuClass"
        :style="menuStyle"
      >
        <div
          v-for="item of menuItems"
          :key="item.key"
          class="m-navbar-menu-item"
          :style="menuItemStyle"
        >
          <slot name="menu-item" v-bind="item"></slot>
        </div>
      </nav>

      <div v-if="$slots.end" ref="end" class="m-navbar-end" :class="endClass" :style="endStyle">
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
    gap: 1.5rem;
  }
}
</style>

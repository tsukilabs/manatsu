<script setup lang="ts">
import { usePixelHeight, usePixelWidth } from '@manatsu/composables/src/index.ts';
import { type MaybeRefOrGetter, type VNode, computed, shallowRef, toRef } from 'vue';
import type { ScaffoldProps, SidebarItem } from './types';

const sidebarItems = defineModel<SidebarItem[]>('sidebarItems');

const props = withDefaults(defineProps<ScaffoldProps>(), {
  defaultBorder: '1px solid var(--m-color-outline-variant)',
  topBarBorder: true,
  bottomBarBorder: true
});

const slots = defineSlots<{
  'bottom-bar'?: () => VNode;
  default?: () => VNode;
  'sidebar-item'?: (props: SidebarItem) => VNode;
  'top-bar'?: () => VNode;
}>();

const topBar = shallowRef<HTMLElement | null>(null);
const topBarHeight = usePixelHeight(topBar);
const topBarBorder = useBorder(() => props.topBarBorder);

const sidebar = shallowRef<HTMLElement | null>(null);
const sidebarWidth = usePixelWidth(sidebar);

const bottomBar = shallowRef<HTMLElement | null>(null);
const bottomBarHeight = usePixelHeight(bottomBar);
const bottomBarBorder = useBorder(() => props.bottomBarBorder);

const contentHeight = computed(() => {
  return `calc(100% - (${topBarHeight.value} + ${bottomBarHeight.value}))`;
});

function useBorder(border: MaybeRefOrGetter<string | boolean>) {
  const borderRef = toRef(border);
  return computed(() => {
    if (!borderRef.value) return 'none';
    if (typeof borderRef.value === 'string') return borderRef.value;
    return props.defaultBorder;
  });
}
</script>

<template>
  <div class="m-scaffold">
    <div
      v-if="$slots['top-bar']"
      ref="topBar"
      class="m-scaffold-top-bar"
      :class="topBarClass"
      :style="topBarStyle"
    >
      <slot name="top-bar"></slot>
    </div>

    <div class="m-scaffold-content">
      <aside
        v-if="sidebarItems && sidebarItems.length > 0"
        ref="sidebar"
        class="m-scaffold-sidebar"
        :class="sidebarClass"
        :style="sidebarStyle"
      >
        <nav>
          <div
            v-for="item of sidebarItems"
            :key="item.key"
            class="m-scaffold-sidebar-item"
            :class="sidebarItemClass"
            :style="sidebarItemStyle"
          >
            <slot name="sidebar-item" v-bind="item"></slot>
          </div>
        </nav>
      </aside>

      <div class="m-scaffold-content-slot" :class="contentClass" :style="contentStyle">
        <slot></slot>
      </div>
    </div>

    <div
      v-if="$slots['bottom-bar']"
      ref="bottomBar"
      class="m-scaffold-bottom-bar"
      :class="bottomBarClass"
      :style="bottomBarStyle"
    >
      <slot name="bottom-bar"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use '@manatsu/sass/flex';

$z-index: 100;

/** This is applied to the top and bottom bars. */
@mixin outside {
  position: fixed;
  left: 0;
  z-index: $z-index;
  background-color: var(--m-color-surface);
  width: 100%;
  overflow: hidden;
}

.m-scaffold {
  position: fixed;
  inset: 0;
  background-color: var(--m-color-surface);
  overflow: hidden;

  &-top-bar {
    @include outside;
    top: 0;
    border-bottom: v-bind('topBarBorder');
  }

  &-content {
    position: relative;
    top: v-bind('topBarHeight');
    height: v-bind('contentHeight');
  }

  &-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: $z-index;
    background-color: var(--m-color-surface);
    padding: 1rem;
    overflow-x: hidden;

    & > nav {
      @include flex.x-start-y-center;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &-content-slot {
    position: absolute;
    inset: 0;
    left: v-bind('sidebarWidth');
    background-color: var(--m-color-surface);
    padding: 1rem;
    overflow-x: hidden;
  }

  &-bottom-bar {
    @include outside;
    bottom: 0;
    border-top: v-bind('bottomBarBorder');
  }
}
</style>

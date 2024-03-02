<script setup lang="ts">
import { usePixelHeight, usePixelWidth } from '@manatsu/composables/src/index.ts';
import { type MaybeRefOrGetter, type VNode, computed, shallowRef, toRef } from 'vue';
import type { ScaffoldProps, SidebarItem } from './types';

const sidebarItems = defineModel<SidebarItem[]>('sidebarItems');

const props = withDefaults(defineProps<ScaffoldProps>(), {
  defaultBorder: '1px solid var(--m-color-outline-variant)',
  topBorder: true,
  bottomBorder: true
});

const slots = defineSlots<{
  bottom?: () => VNode;
  default?: () => VNode;
  'sidebar-item'?: (props: SidebarItem) => VNode;
  top?: () => VNode;
}>();

const top = shallowRef<HTMLElement | null>(null);
const topHeight = usePixelHeight(top);
const topBorder = useBorder(() => props.topBorder);

const sidebar = shallowRef<HTMLElement | null>(null);
const sidebarWidth = usePixelWidth(sidebar);

const bottom = shallowRef<HTMLElement | null>(null);
const bottomHeight = usePixelHeight(bottom);
const bottomBorder = useBorder(() => props.bottomBorder);

const contentHeight = computed(() => {
  return `calc(100% - (${topHeight.value} + ${bottomHeight.value}))`;
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
    <div v-if="$slots.top" ref="top" class="m-scaffold-top" :class="topClass" :style="topStyle">
      <slot name="top"></slot>
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
      v-if="$slots.bottom"
      ref="bottom"
      class="m-scaffold-bottom"
      :class="bottomClass"
      :style="bottomStyle"
    >
      <slot name="bottom"></slot>
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

  &-top {
    @include outside;
    top: 0;
    border-bottom: v-bind('topBorder');
  }

  &-content {
    position: relative;
    top: v-bind('topHeight');
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

  &-bottom {
    @include outside;
    bottom: 0;
    border-top: v-bind('bottomBorder');
  }
}
</style>

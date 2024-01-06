<script setup lang="ts">
import { type VNode, shallowRef } from 'vue';
import { useIsEmpty, usePixelHeight, usePixelWidth } from '@manatsu/composables/src/index.ts';
import type { ScaffoldProps, SidebarItem } from './types';

const props = defineProps<ScaffoldProps>();

const slots = defineSlots<{
  default?: () => VNode;
  header?: () => VNode;
  'sidebar-item'?: (props: SidebarItem) => VNode;
}>();

const header = shallowRef<HTMLElement | null>(null);
const headerHeight = usePixelHeight(header);

const sidebar = shallowRef<HTMLElement | null>(null);
const sidebarWidth = usePixelWidth(sidebar);
const isSidebarEmpty = useIsEmpty(() => props.sidebarItems);
</script>

<template>
  <div class="m-scaffold">
    <div
      v-if="$slots.header"
      ref="header"
      class="m-scaffold-header"
      :class="headerClass"
      :style="headerStyle"
    >
      <slot name="header"></slot>
    </div>

    <div class="m-scaffold-content">
      <aside
        v-if="!isSidebarEmpty"
        ref="sidebar"
        class="m-scaffold-sidebar"
        :class="sidebarClass"
        :style="sidebarStyle"
      >
        <nav>
          <div v-for="item of sidebarItems" :key="item.key" class="m-scaffold-sidebar-item">
            <slot name="sidebar-item" v-bind="item"></slot>
          </div>
        </nav>
      </aside>

      <div class="m-scaffold-content-slot" :class="contentClass" :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-scaffold {
  position: fixed;
  inset: 0;
  background-color: var(--m-color-surface);
  overflow: hidden;
}

.m-scaffold-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  background-color: var(--m-color-surface);
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.m-scaffold-content {
  position: relative;
  top: v-bind('headerHeight');
  bottom: 0;
  height: v-bind('`calc(100% - ${headerHeight})`');

  .m-scaffold-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 40;
    background-color: var(--m-color-surface);
    padding: 1rem;
    overflow: hidden;
    user-select: none;

    & > nav {
      @include flex.x-start-y-center;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .m-scaffold-content-slot {
    position: absolute;
    inset: 0;
    left: v-bind('sidebarWidth');
    background-color: var(--m-color-surface-container);
    padding: 1rem;
    overflow-x: hidden;
  }
}
</style>

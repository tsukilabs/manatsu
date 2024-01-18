<script setup lang="ts">
import { type VNode, computed, shallowRef } from 'vue';
import { usePixelHeight, usePixelWidth } from '@manatsu/composables/src/index.ts';
import type { ScaffoldProps, SidebarItem } from './types';

defineProps<ScaffoldProps>();

const slots = defineSlots<{
  default?: () => VNode;
  footer?: () => VNode;
  header?: () => VNode;
  'sidebar-item'?: (props: SidebarItem) => VNode;
}>();

const header = shallowRef<HTMLElement | null>(null);
const headerHeight = usePixelHeight(header);

const sidebar = shallowRef<HTMLElement | null>(null);
const sidebarItems = defineModel<SidebarItem[]>('sidebarItems');
const sidebarWidth = usePixelWidth(sidebar);

const footer = shallowRef<HTMLElement | null>(null);
const footerHeight = usePixelHeight(footer);

const containerHeight = computed(() => {
  return `calc(100% - (${headerHeight.value} + ${footerHeight.value}))`;
});
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

    <div class="m-scaffold-container">
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

      <div class="m-scaffold-content" :class="contentClass" :style="contentStyle">
        <slot></slot>
      </div>
    </div>

    <div
      v-if="$slots.footer"
      ref="footer"
      class="m-scaffold-footer"
      :class="footerClass"
      :style="footerStyle"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use '@manatsu/sass/flex';

$z-index: 100;

@mixin outside {
  position: fixed;
  left: 0;
  z-index: $z-index;
  background-color: var(--m-color-surface-container);
  width: 100%;
  overflow: hidden;
}

.m-scaffold {
  position: fixed;
  inset: 0;
  background-color: var(--m-color-surface-container);
  overflow: hidden;

  &-header {
    @include outside;
    top: 0;
  }

  &-container {
    position: relative;
    top: v-bind('headerHeight');
    height: v-bind('containerHeight');
  }

  &-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: $z-index;
    background-color: var(--m-color-background);
    padding: 1rem;
    overflow-x: hidden;

    & > nav {
      @include flex.x-start-y-center;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &-content {
    position: absolute;
    inset: 0;
    left: v-bind('sidebarWidth');
    background-color: var(--m-color-background);
    padding: 1rem;
    overflow-x: hidden;
  }

  &-footer {
    @include outside;
    bottom: 0;
  }
}
</style>

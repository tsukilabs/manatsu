<script setup lang="ts">
import { type VNode, computed } from 'vue';
import type { ScaffoldProps, SidebarItem } from './types';

const props = defineProps<ScaffoldProps>();

defineSlots<{
  default?: () => VNode;
  header?: () => VNode;
  'sidebar-item'?: (props: SidebarItem) => VNode;
}>();

const hasSidebar = computed(() => {
  return props.sidebarItems && props.sidebarItems.length > 0;
});
</script>

<template>
  <div class="m-scaffold" :style="style">
    <div v-if="$slots.header" class="m-scaffold-header" :style="headerStyle">
      <slot name="header"></slot>
    </div>

    <div class="m-scaffold-container">
      <aside v-if="hasSidebar" class="m-scaffold-sidebar" :style="sidebarStyle">
        <nav class="m-scaffold-sidebar-nav">
          <div
            v-for="item of sidebarItems"
            :key="item.key"
            class="m-scaffold-sidebar-item"
            :style="sidebarItemStyle"
          >
            <slot name="sidebar-item" v-bind="item"></slot>
          </div>
        </nav>
      </aside>

      <div class="m-scaffold-content" :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.m-scaffold {
  display: flex;
  flex-direction: column;
  background-color: var(--m-color-surface);
  min-width: 320px;
  min-height: 100vh;
  overflow: hidden;
}

.m-scaffold-container {
  @include flex.x-start-y-stretch;
  flex: 1 1 auto;
  background-color: var(--m-color-surface-container);

  .m-scaffold-sidebar {
    background-color: var(--m-color-surface);
    padding: 1rem 2rem;
  }

  .m-scaffold-content {
    padding: 1rem;
  }
}
</style>

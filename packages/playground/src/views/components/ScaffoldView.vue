<script setup lang="ts">
import { symbols } from 'manatsu/src/index.ts';

const scaffoldTopHeight = inject(symbols.scaffoldTopHeight);
const scaffoldBottomHeight = inject(symbols.scaffoldBottomHeight);
const scaffoldContentHeight = inject(symbols.scaffoldContentHeight);
const scaffoldSidebarWidth = inject(symbols.scaffoldSidebarWidth);

const showBottom = inject(symbols.showScaffoldBottom);
const showSidebar = inject(symbols.showScaffoldSidebar);
const showTop = inject(symbols.showScaffoldTop);
const showOnlyContent = inject(symbols.showOnlyScaffoldContent);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <m-button @click="showTop = !showTop">Top</m-button>
      <m-button @click="showSidebar = !showSidebar">Sidebar</m-button>
      <m-button @click="showBottom = !showBottom">Bottom</m-button>
      <m-button @click="showOnlyContent = !showOnlyContent">Content</m-button>
    </div>

    <m-card class="w-max">
      <div>scaffoldTopHeight: {{ scaffoldTopHeight }}</div>
      <div>scaffoldBottomHeight: {{ scaffoldBottomHeight }}</div>
      <div>scaffoldContentHeight: {{ scaffoldContentHeight }}</div>
      <div>scaffoldSidebarWidth: {{ scaffoldSidebarWidth }}</div>
    </m-card>
  </div>
</template>

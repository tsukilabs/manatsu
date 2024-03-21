<script setup lang="ts">
import { symbols } from 'manatsu/src/index.ts';

const scaffoldTopHeight = inject(symbols.scaffoldTopHeight);
const scaffoldBottomHeight = inject(symbols.scaffoldBottomHeight);
const scaffoldContentHeight = inject(symbols.scaffoldContentHeight);
const scaffoldSidebarWidth = inject(symbols.scaffoldSidebarWidth);

const showSidebar = inject(symbols.showScaffoldSidebar);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <m-button variant="outlined" @click="showSidebar = !showSidebar">Toggle Sidebar</m-button>
    </div>

    <m-card variant="outlined" class="w-max">
      <div>scaffoldTopHeight: {{ scaffoldTopHeight }}</div>
      <div>scaffoldBottomHeight: {{ scaffoldBottomHeight }}</div>
      <div>scaffoldContentHeight: {{ scaffoldContentHeight }}</div>
      <div>scaffoldSidebarWidth: {{ scaffoldSidebarWidth }}</div>
    </m-card>
  </div>
</template>

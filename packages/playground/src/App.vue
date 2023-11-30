<script setup lang="ts">
import { MButton } from '@manatsu/components/index.ts';
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>Hello world!</div>
      <MButton type="filled">Filled</MButton>
      <MButton type="tonal">Tonal</MButton>
    </div>
    <div class="flex gap-2">
      <MButton>A</MButton>
      <MButton>Inside flex</MButton>
      <MButton>Inside flex with more text</MButton>
    </div>
  </main>
</template>

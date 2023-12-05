<script setup lang="ts">
import { MButton, MInput } from '@manatsu/components/index.ts';
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex gap-2">
      <MButton elevated>Elevated</MButton>
      <MButton filled>Filled</MButton>
      <MButton tonal>Tonal</MButton>
      <MButton outlined>Outlined</MButton>
      <MButton text>Text</MButton>
    </div>
    <div class="flex gap-2">
      <MInput filled />
      <MInput outlined />
    </div>
  </main>
</template>

<style lang="scss"></style>

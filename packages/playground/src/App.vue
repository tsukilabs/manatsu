<script setup lang="ts">
import { MButton, MInput } from '@manatsu/components/index.ts';
</script>

<template>
  <main>
    <div>
      <MButton elevated>Elevated</MButton>
      <MButton filled>Filled</MButton>
      <MButton tonal>Tonal</MButton>
      <MButton outlined>Outlined</MButton>
      <MButton text>Text</MButton>
    </div>
    <div>
      <MInput filled />
      <MInput outlined />
    </div>
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

main > div:first-child {
  display: flex;
  gap: 1rem;
}

main > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

<script setup lang="ts">
import { MButton, MInput } from '@manatsu/components/src/index.ts';
import LoremIpsum from './LoremIpsum.vue';
</script>

<template>
  <main>
    <div>
      <MButton>MButton</MButton>
      <MButton variant="outlined">Outlined</MButton>
      <MButton>Lorem ipsum dolor</MButton>
    </div>
    <div>
      <MInput placeholder="Text field" />
    </div>

    <LoremIpsum v-for="n of 5" :key="n" :paragraphs="3" />
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

main > div {
  display: flex;
  gap: 1rem;
}
</style>

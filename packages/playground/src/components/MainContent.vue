<script setup lang="ts">
import { ref } from 'vue';
import { MButton, MInput } from '@manatsu/components/src/index.ts';
import LoremIpsum from './LoremIpsum.vue';

const inputValue = ref<string | null>(null);
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex gap-4">
      <MButton>MButton</MButton>
      <MButton variant="outlined">Outlined</MButton>
      <MButton>Lorem ipsum dolor</MButton>
    </div>
    <div>
      <MInput v-model:value="inputValue" placeholder="Text field" />
    </div>

    <LoremIpsum v-for="n of 5" :key="n" :paragraphs="3" />
  </main>
</template>

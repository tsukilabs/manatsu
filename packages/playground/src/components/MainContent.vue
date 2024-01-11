<script setup lang="ts">
import { ref } from 'vue';
import { MButton, MCard, MInput } from '@manatsu/components/src/index.ts';
import LoremIpsum from './LoremIpsum.vue';

const inputValue = ref<string | null>(null);
const cardVariants = ['filled', 'elevated', 'outlined'] as const;
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

    <div class="flex gap-8">
      <MCard
        v-for="variant of cardVariants"
        :key="variant"
        :variant="variant"
        :title="variant"
        subtitle="subtitle"
        class="w-72"
      >
        <template #header-start>
          <img src="/peach.png" />
        </template>

        <template #header-end>
          <MButton variant="outlined">Action</MButton>
        </template>

        <template #media>
          <img src="/katsuo.png" class="w-96" />
        </template>

        <template #default>
          <LoremIpsum :paragraphs="1" class="h-36" />
        </template>

        <template #footer>
          <MButton variant="outlined">Action</MButton>
        </template>
      </MCard>
    </div>

    <LoremIpsum :paragraphs="5" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { capitalize } from 'lodash-es';
import { MButton, MCard, MCheckbox, MInput } from '@manatsu/components/src/index.ts';
import LoremIpsum from '../components/LoremIpsum.vue';

const inputValue = ref<string | null>(null);
const checkboxValue = ref(false);

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
  <main class="flex flex-col gap-4">
    <div class="flex gap-4">
      <template v-for="variant of variants" :key="variant">
        <MButton :variant="variant">{{ capitalize(variant) }}</MButton>
        <MButton :variant="variant" disabled>{{ capitalize(variant) }}</MButton>
      </template>
    </div>
    <div class="flex gap-4 items-center">
      <MInput v-model:value="inputValue" placeholder="Text field" />
      <MCheckbox v-model:checked="checkboxValue">Checkbox</MCheckbox>
      <MCheckbox v-model:checked="checkboxValue" disabled>Disabled</MCheckbox>
    </div>

    <div class="flex gap-8">
      <MCard
        v-for="variant of variants"
        :key="variant"
        :variant="variant"
        :title="capitalize(variant)"
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

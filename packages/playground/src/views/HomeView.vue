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
    <div class="flex items-stretch gap-4">
      <MCard variant="outlined" title="Input" header-style="padding-bottom: 0;">
        <MInput v-model:value="inputValue" placeholder="Text field" />
      </MCard>
      <MCard
        variant="outlined"
        title="Checkbox"
        header-style="padding-bottom: 0;"
        content-class="flex gap-4"
      >
        <MCheckbox v-model:checked="checkboxValue">Label</MCheckbox>
        <MCheckbox v-model:checked="checkboxValue" disabled>Disabled</MCheckbox>
      </MCard>
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
          <LoremIpsum class="h-36" />
        </template>

        <template #footer>
          <MButton variant="outlined">Action</MButton>
        </template>
      </MCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { capitalize } from 'lodash-es';
import LoremIpsum from '../../components/LoremIpsum.vue';

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
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
</template>

<script setup lang="ts">
import { capitalize } from 'lodash-es';
import LoremIpsum from '../../components/LoremIpsum.vue';

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
  <div class="flex gap-8">
    <m-card
      v-for="cardVariant of variants"
      :key="cardVariant"
      :variant="cardVariant"
      :title="capitalize(cardVariant)"
      subtitle="subtitle"
      class="w-72"
    >
      <template #header-start>
        <img src="/peach.png" />
      </template>

      <template #header-end>
        <m-button variant="outlined">Action</m-button>
      </template>

      <template #media>
        <img src="/katsuo.png" class="w-96" />
      </template>

      <template #default>
        <LoremIpsum class="h-36" />
      </template>

      <template #footer>
        <m-button variant="outlined">Action</m-button>
      </template>
    </m-card>
  </div>
</template>

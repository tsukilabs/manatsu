<script setup lang="ts">
import { capitalize } from 'lodash-es';

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
  <div class="flex gap-8">
    <m-card
      v-for="variant of variants"
      :key="variant"
      :variant
      :title="capitalize(variant)"
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
        <lorem-ipsum class="h-36" />
      </template>

      <template #footer>
        <m-button variant="outlined">Action</m-button>
      </template>
    </m-card>
  </div>
</template>

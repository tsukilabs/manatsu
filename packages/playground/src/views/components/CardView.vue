<script setup lang="ts">
import { capitalize } from 'lodash-es';
import type { CardVariant } from 'manatsu/src/index.ts';

const variants: CardVariant[] = ['filled', 'elevated', 'outlined'];
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
        <m-button>Action</m-button>
      </template>

      <template #media>
        <img src="/katsuo.png" class="w-96" />
      </template>

      <template #default>
        <lorem-ipsum class="h-36" />
      </template>

      <template #footer>
        <m-button>Action</m-button>
      </template>
    </m-card>
  </div>
</template>

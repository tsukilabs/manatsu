<script setup lang="ts">
import { capitalize } from 'lodash-es';

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
  <div class="flex gap-4">
    <template v-for="variant of variants" :key="variant">
      <MButton :variant="variant">{{ capitalize(variant) }}</MButton>
      <MButton :variant="variant" disabled>{{ capitalize(variant) }}</MButton>
    </template>
  </div>
</template>

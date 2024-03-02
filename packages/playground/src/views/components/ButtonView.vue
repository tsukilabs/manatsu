<script setup lang="ts">
import { capitalize } from 'lodash-es';

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
  <div class="flex gap-4">
    <template v-for="variant of variants" :key="variant">
      <m-button :variant="variant">{{ capitalize(variant) }}</m-button>
      <m-button :variant="variant" disabled>{{ capitalize(variant) }}</m-button>
    </template>
  </div>
</template>

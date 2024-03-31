<script setup lang="ts">
import { capitalize } from 'lodash-es';
import type { ChipVariant } from 'manatsu/src/index.ts';

const variants: ChipVariant[] = ['filled', 'elevated', 'outlined'];
</script>

<template>
  <div class="flex gap-4">
    <template v-for="variant of variants" :key="variant">
      <m-chip :variant>{{ capitalize(variant) }}</m-chip>
      <m-chip :variant removable>{{ capitalize(variant) }}</m-chip>
    </template>
  </div>
</template>

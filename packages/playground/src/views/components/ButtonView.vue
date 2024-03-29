<script setup lang="ts">
import { capitalize } from 'lodash-es';
import type { ButtonVariant } from 'manatsu/src/index.ts';

const variants: ButtonVariant[] = ['filled', 'elevated', 'outlined'];
</script>

<template>
  <div class="flex gap-4">
    <template v-for="variant of variants" :key="variant">
      <m-button :variant>{{ capitalize(variant) }}</m-button>
      <m-button :variant disabled>{{ capitalize(variant) }}</m-button>
    </template>
  </div>
</template>

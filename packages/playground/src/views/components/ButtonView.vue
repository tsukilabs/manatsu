<script setup lang="ts">
import { capitalize } from 'lodash-es';

const variants = ['filled', 'elevated', 'outlined'] as const;
</script>

<template>
  <div class="flex gap-4">
    <!-- https://github.com/tsukilabs/manatsu/issues/113#issuecomment-1979046526 -->
    <template v-for="variant of variants" :key="variant">
      <!-- eslint-disable-next-line vue/v-bind-style -->
      <m-button :variant="variant">{{ capitalize(variant) }}</m-button>
      <!-- eslint-disable-next-line vue/v-bind-style -->
      <m-button :variant="variant" disabled>{{ capitalize(variant) }}</m-button>
    </template>
  </div>
</template>

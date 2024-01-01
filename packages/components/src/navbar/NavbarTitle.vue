<script setup lang="ts">
import type { NavbarTitleProps } from './types';

defineProps<NavbarTitleProps>();
</script>

<template>
  <component :is="title" v-if="typeof title === 'function'" />
  <span v-else>{{ title }}</span>
</template>

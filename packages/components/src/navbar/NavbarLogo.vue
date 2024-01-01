<script setup lang="ts">
import type { NavbarLogoProps } from './types';

defineProps<NavbarLogoProps>();
</script>

<template>
  <component :is="logo" v-if="typeof logo === 'function'" />
  <img v-else :src="logo" />
</template>

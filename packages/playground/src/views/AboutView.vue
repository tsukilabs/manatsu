<script setup lang="ts">
import { useInvoke } from '@manatsu/composables/src/index.ts';

const { state: copyright } = useInvoke<string>('copyright');
</script>

<template>
  <span>{{ copyright }}</span>
</template>

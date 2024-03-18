<script setup lang="ts">
import { useInvoke } from '../utils';

const copyright = useInvoke<string | null>('copyright', null);
</script>

<template>
  <span>{{ copyright }}</span>
</template>

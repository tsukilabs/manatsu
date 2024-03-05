<script setup lang="ts">
import { useInvoke } from '../utils';

const { state: copyright } = useInvoke<string | null>('copyright', {
  initial: null
});
</script>

<template>
  <span>{{ copyright }}</span>
</template>

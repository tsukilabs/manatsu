<script setup lang="ts">
import { useInvoke } from '../utils';

const { state: copyright } = useInvoke<string>('copyright');
</script>

<template>
  <span>{{ copyright }}</span>
</template>

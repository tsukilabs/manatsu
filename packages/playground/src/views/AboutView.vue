<script setup lang="ts">
import { PlaygroundCommand } from '@/utils';
import { useInvoke } from '@manatsu/composables/src/index.ts';

const copyright = useInvoke<string | null>(PlaygroundCommand.Copyright, null);
</script>

<template>
  <span>{{ copyright }}</span>
</template>

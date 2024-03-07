<script setup lang="ts">
import { inject, ref } from 'vue';
import { privateSymbols } from '@manatsu/shared';
import MDialog from './MDialog.vue';

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'show'): void;
}>();

const visible = inject(privateSymbols.dynamicDialogVisible, () => ref(false), true);
</script>

<template>
  <m-dialog v-model:visible="visible" @hide="$emit('hide')" @show="$emit('show')" />
</template>

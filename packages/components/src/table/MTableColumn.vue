<script setup lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, triggerRef } from 'vue';
import { getTableColumnMapKey } from './utils';
import type { TableColumnProps } from './types';

const props = defineProps<TableColumnProps>();

const columns = inject(getTableColumnMapKey(), null);
const columnSymbol = Symbol('manatsu-table-column');

const column = defineComponent({
  render() {
    return null;
  }
});

onMounted(() => {
  if (columns) {
    columns.value.set(columnSymbol, {
      field: props.field,
      name: props.name
    });

    triggerRef(columns);
  }
});

onUnmounted(() => {
  if (columns) {
    columns.value.delete(columnSymbol);
    triggerRef(columns);
  }
});
</script>

<template>
  <column />
</template>

<script setup lang="ts">
import { type VNode, defineComponent, inject, onMounted, onUnmounted, triggerRef } from 'vue';
import { columnMapKey } from './symbols';
import type { TableColumn, TableColumnProps } from './types';

const props = defineProps<TableColumnProps>();

const slots = defineSlots<{
  body?: (slotProps: { row: any }) => VNode;
  header?: (slotProps: { column: TableColumnProps }) => VNode;
}>();

const columns = inject(columnMapKey, null);
const columnSymbol = Symbol('m-table-column');

const emptyComponent = defineComponent({
  render() {
    return null;
  }
});

onMounted(() => {
  if (columns) {
    const column: TableColumn = {
      props: {
        field: props.field,
        name: props.name
      },
      slots: {
        body: slots.body,
        header: slots.header
      }
    };

    columns.value.set(columnSymbol, column);
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
  <empty-component />
</template>

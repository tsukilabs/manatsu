<script setup lang="ts">
import { injectStrict } from '@manatsu/shared';
import { type VNode, defineComponent, onMounted, onUnmounted, triggerRef } from 'vue';
import { columnMapKey } from './symbols';
import type {
  TableColumn,
  TableColumnBodySlotProps,
  TableColumnHeaderSlotProps,
  TableColumnProps
} from './types';

const props = withDefaults(defineProps<TableColumnProps>(), {
  sortable: true
});

const slots = defineSlots<{
  body?: (slotProps: TableColumnBodySlotProps) => VNode;
  header?: (slotProps: TableColumnHeaderSlotProps) => VNode;
}>();

const columns = injectStrict(columnMapKey);
const columnSymbol = Symbol();

const emptyComponent = defineComponent({
  render() {
    return null;
  }
});

onMounted(() => {
  const column: TableColumn = {
    props: {
      bodyClass: props.bodyClass,
      bodyStyle: props.bodyStyle,
      columnKey: props.columnKey,
      field: props.field,
      headerClass: props.headerClass,
      headerStyle: props.headerStyle,
      name: props.name,
      sortFn: props.sortFn,
      sortable: props.sortable
    },
    slots: {
      body: slots.body,
      header: slots.header
    }
  };

  columns.value.set(columnSymbol, column);
  triggerRef(columns);
});

onUnmounted(() => {
  columns.value.delete(columnSymbol);
  triggerRef(columns);
});
</script>

<template>
  <empty-component />
</template>

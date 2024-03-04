<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, provide, shallowRef } from 'vue';
import type { TableProps } from './types';
import { type TableColumnMap, getTableColumnMapKey } from './utils';

const rows = defineModel<T[]>({ required: true });

defineProps<TableProps<T>>();

const columnMap = shallowRef<TableColumnMap<T>>(new Map());
provide(getTableColumnMapKey<T>(), columnMap);

const columns = computed(() => Array.from(columnMap.value.values()));
</script>

<template>
  <table class="m-table">
    <thead>
      <tr>
        <th v-for="column of columns" :key="column.field">
          {{ column.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row of rows" :key="rowKey(row)">
        <td v-for="column of columns" :key="column.field">
          {{ row[column.field] }}
        </td>
      </tr>
    </tbody>
  </table>

  <slot></slot>
</template>

<style lang="scss">
.m-table {
  border-collapse: collapse;
  width: 100%;

  th {
    border-bottom: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
}
</style>

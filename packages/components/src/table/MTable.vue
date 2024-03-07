<script setup lang="ts">
import { toPixel } from '@tb-dev/utils';
import { whenever } from '@vueuse/core';
import { symbols } from '@manatsu/shared';
import { computed, inject, isRef, onUnmounted, provide, shallowRef } from 'vue';
import { columnMapKey } from './symbols';
import { intoNestedValue } from './utils';
import type { TableColumnMap, TableProps } from './types';

const rows = defineModel<any[]>({ required: true });

const props = withDefaults(defineProps<TableProps>(), {
  scrollable: true,
  sortOrder: 'asc',
  striped: true,
  tableLayout: 'auto'
});

const containerClassList = computed(() => {
  const classes = ['m-table-container'];
  if (props.scrollable) classes.push('m-table-container-scrollable');
  return classes;
});

const tableClassList = computed(() => {
  const classes = ['m-table'];
  if (props.striped) classes.push('m-table-striped');
  if (props.tableClass) classes.push(props.tableClass);
  return classes;
});

const scaffoldContentHeight = inject(symbols.scaffoldContentHeight);
const tableMaxHeight = computed(() => {
  if (props.maxHeight) return toPixel(props.maxHeight);
  if (isRef(scaffoldContentHeight)) {
    const height = toPixel(scaffoldContentHeight.value);
    return `calc(${height} - (var(--m-scaffold-content-padding) * 2))`;
  }

  return 'auto';
});

const columnMap = shallowRef<TableColumnMap>(new Map());
provide(columnMapKey, columnMap);

const columns = computed(() => Array.from(columnMap.value.values()));

whenever(() => props.sortField, sort, { immediate: true, once: true });

function sort(field: unknown) {
  if (typeof field !== 'string') return;
  rows.value.sort((a, b) => {
    const first = intoNestedValue(props.sortOrder === 'asc' ? a : b, field);
    const second = intoNestedValue(props.sortOrder === 'asc' ? b : a, field);

    if (typeof first === 'number' && typeof second === 'number') {
      return first - second;
    }

    return String(first).localeCompare(String(second));
  });
}

onUnmounted(() => {
  columnMap.value.clear();
});
</script>

<template>
  <div :class="containerClassList">
    <table :class="tableClassList" :style="tableStyle">
      <thead class="m-table-head" :class="theadClass" :style="theadStyle">
        <tr :class="theadRowClass" :style="theadRowStyle">
          <th
            v-for="column of columns"
            :key="column.props.field"
            :class="column.props.headerClass"
            :style="column.props.headerStyle"
          >
            <component
              :is="column.slots.header"
              v-if="column.slots.header"
              :column="column.props"
            />
            <span v-else>{{ column.props.name }}</span>
          </th>
        </tr>
      </thead>

      <tbody class="m-table-body" :class="tbodyClass" :style="tbodyStyle">
        <tr v-for="row of rows" :key="rowKey(row)" :class="tbodyRowClass" :style="tbodyRowStyle">
          <td
            v-for="column of columns"
            :key="column.props.field"
            :class="column.props.bodyClass"
            :style="column.props.bodyStyle"
          >
            <!-- eslint-disable-next-line vue/v-bind-style -->
            <component :is="column.slots.body" v-if="column.slots.body" :row="row" />
            <span v-else>{{ intoNestedValue(row, column.props.field) }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <slot></slot>
  </div>
</template>

<style lang="scss">
.m-table-container {
  width: 100%;
  overflow-y: auto;
}

.m-table-container-scrollable {
  max-height: v-bind('tableMaxHeight');

  & thead {
    position: sticky;
    top: 0;
  }
}

.m-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: v-bind('tableLayout');

  &-head {
    background-color: var(--m-color-surface-container-highest);
  }

  &-head th {
    border-bottom: 1px solid var(--m-color-outline-variant);
    padding: 8px;
    text-align: left;
  }

  &-body td {
    padding: 8px;
    text-align: left;
  }

  &-striped tr:nth-child(even) {
    background-color: var(--m-color-surface-container);
  }
}
</style>

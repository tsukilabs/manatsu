<script setup lang="ts">
import { until } from '@vueuse/core';
import { isNullish, toPixel } from '@tb-dev/utils';
import type { Nullish } from '@tb-dev/utility-types';
import { type SortOrder, compare, handleError, symbols } from '@manatsu/shared';
import {
  type VNode,
  computed,
  inject,
  isRef,
  onUnmounted,
  provide,
  shallowRef,
  triggerRef
} from 'vue';
import { columnMapKey } from './symbols';
import { intoNestedValue } from './utils';
import type { ColumnMap, ColumnSortFn, TableColumn, TableProps, TableRowClickEvent } from './types';

const rows = defineModel<any[]>({ required: true });

const props = withDefaults(defineProps<TableProps>(), {
  scrollable: true,
  sortable: true,
  sortOrder: 'asc',
  striped: true,
  tableLayout: 'auto'
});

defineEmits<(e: 'row-click' | 'row-dblclick', value: TableRowClickEvent) => void>();

defineSlots<{ default?: () => VNode }>();

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

// Columns
const columnMap = shallowRef<ColumnMap>(new Map());
const columns = computed(() => Array.from(columnMap.value.values()));
provide(columnMapKey, columnMap);

// Sort
function sort(field: unknown, order: SortOrder, sortFn: Nullish<ColumnSortFn>) {
  if (typeof field !== 'string') return;
  rows.value.sort((a, b) => {
    if (sortFn) {
      const result = sortFn(a, b, compare);
      return order === 'asc' ? result : -result;
    }

    const first = intoNestedValue(order === 'asc' ? a : b, field);
    const second = intoNestedValue(order === 'asc' ? b : a, field);
    return compare(first, second);
  });

  // We manually trigger the model so ShallowRefs can detect the change.
  triggerRef(rows);
}

function onColumnClick(column: TableColumn) {
  if (props.sortable && column.props.sortable) {
    const order: SortOrder = column.order ?? 'asc';
    column.order = order === 'asc' ? 'desc' : 'asc';
    sort(column.props.field, order, column.props.sortFn);
  }
}

until(rows)
  .toMatch((r) => r.length > 0, { deep: false })
  .then(() => {
    if (props.sortField) {
      sort(props.sortField, props.sortOrder ?? 'asc', null);
    }
  })
  .catch(handleError);

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
            v-for="(column, index) of columns"
            :key="column.props.columnKey ?? column.props.field ?? index"
            :class="column.props.headerClass"
            :style="column.props.headerStyle"
            @click="onColumnClick(column)"
          >
            <component
              :is="column.slots.header"
              v-if="column.slots.header"
              :column="column.props"
            />
            <span v-else-if="!isNullish(column.props.name)">
              {{ column.props.name }}
            </span>
          </th>
        </tr>
      </thead>

      <tbody class="m-table-body" :class="tbodyClass" :style="tbodyStyle">
        <tr
          v-for="(data, index) of rows"
          :key="rowKey(data)"
          :class="tbodyRowClass"
          :style="tbodyRowStyle"
          @click="$emit('row-click', { index, data, event: $event })"
          @dblclick="$emit('row-dblclick', { index, data, event: $event })"
        >
          <td
            v-for="column of columns"
            :key="column.props.columnKey ?? column.props.field ?? index"
            :class="column.props.bodyClass"
            :style="column.props.bodyStyle"
          >
            <component :is="column.slots.body" v-if="column.slots.body" :index :row="data" />
            <span v-else-if="!isNullish(column.props.field)">
              {{ intoNestedValue(data, column.props.field) }}
            </span>
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

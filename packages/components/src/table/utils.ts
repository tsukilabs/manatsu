import type { InjectionKey, ShallowRef } from 'vue';
import type { TableColumnProps } from './types';

export type TableColumnMap<T extends Record<string, unknown>> = Map<symbol, TableColumnProps<T>>;
const tableColumnMapKey = Symbol('manatsu-table-column-map');

export function getTableColumnMapKey<T extends Record<string, unknown>>() {
  return tableColumnMapKey as InjectionKey<ShallowRef<TableColumnMap<T>>>;
}

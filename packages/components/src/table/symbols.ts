import type { InjectionKey, ShallowRef } from 'vue';
import type { TableColumnMap } from './types';

type ColumnMapSymbol = InjectionKey<ShallowRef<TableColumnMap>>;
export const columnMapKey = Symbol('m-table-column-map') as ColumnMapSymbol;

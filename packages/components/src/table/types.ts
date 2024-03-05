import type { StyleValue, VNode } from 'vue';

export interface TableColumn {
  props: TableColumnProps;
  slots: {
    body?: (slotProps: { row: any }) => VNode;
    header?: (slotProps: { column: TableColumnProps }) => VNode;
  };
}

export type TableColumnMap = Map<symbol, TableColumn>;

export type TableRow = Record<string, unknown>;

export interface TableProps<T extends TableRow> {
  maxHeight?: string | number;
  rowKey: (row: T) => string | number;
  scrollable?: boolean;
  /** Field used to sort the table by default. */
  sortField?: keyof T;
  /** Order to sort the table by default. */
  sortOrder?: 'asc' | 'desc';
  striped?: boolean;
  tableClass?: string;
  tableLayout?: 'auto' | 'fixed';
  tableStyle?: StyleValue;
  tbodyClass?: string;
  tbodyRowClass?: string;
  tbodyRowStyle?: StyleValue;
  tbodyStyle?: StyleValue;
  theadClass?: string;
  theadRowClass?: string;
  theadRowStyle?: StyleValue;
  theadStyle?: StyleValue;
}

export interface TableColumnProps {
  field: string;
  name: string;
}

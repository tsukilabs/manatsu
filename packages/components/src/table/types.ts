import type { StyleValue, VNode } from 'vue';

export interface TableColumnBodySlotProps {
  index: number;
  row: any;
}

export interface TableColumnHeaderSlotProps {
  column: TableColumnProps;
}

export interface TableColumn {
  props: TableColumnProps;
  slots: {
    body?: (slotProps: TableColumnBodySlotProps) => VNode;
    header?: (slotProps: TableColumnHeaderSlotProps) => VNode;
  };
}

export type TableColumnMap = Map<symbol, TableColumn>;

export interface TableProps {
  maxHeight?: string | number;
  rowKey: (row: any) => string | number;
  scrollable?: boolean;
  /** Field used to sort the table by default. */
  sortField?: string;
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
  bodyClass?: string;
  bodyStyle?: StyleValue;
  field: string;
  headerClass?: string;
  headerStyle?: StyleValue;
  name: string;
}

export interface TableClickEvent {
  /** Clicked row data. */
  data: any;
  /** Original DOM event. */
  event: MouseEvent;
  /** Row index. */
  index: number;
}

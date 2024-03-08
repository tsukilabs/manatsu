import type { StyleValue, VNode } from 'vue';
import type { SortOrder } from '@manatsu/shared';
import type { Nullish } from '@tb-dev/utility-types';

export interface TableColumn {
  props: TableColumnProps;
  slots: {
    body?: (slotProps: TableColumnBodySlotProps) => VNode;
    header?: (slotProps: TableColumnHeaderSlotProps) => VNode;
  };

  order?: Nullish<SortOrder>;
}

export type ColumnMap = Map<symbol, TableColumn>;

export interface TableProps {
  maxHeight?: string | number;
  rowKey: (row: any) => string | number;
  scrollable?: boolean;
  /** Field used to sort the table by default. */
  sortField?: string;
  /** Order to sort the table by default. */
  sortOrder?: SortOrder;
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
  sortable?: boolean;
}

export interface TableColumnBodySlotProps {
  index: number;
  row: any;
}

export interface TableColumnHeaderSlotProps {
  column: TableColumnProps;
}

export interface TableRowClickEvent {
  /** Clicked row data. */
  data: any;
  /** Original DOM event. */
  event: MouseEvent;
  /** Row index. */
  index: number;
}

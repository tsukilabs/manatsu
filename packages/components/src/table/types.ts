export interface TableProps<T extends Record<string, unknown>> {
  rowKey: (row: T) => string | number;
}

export interface TableColumnProps {
  field: string;
  name: string;
}

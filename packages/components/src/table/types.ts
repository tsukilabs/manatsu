export interface TableProps<T extends Record<string, unknown>> {
  rowKey: (row: T) => string | number;
}

export interface TableColumnProps<T extends Record<string, unknown>> {
  field: keyof T;
  name: string;
}

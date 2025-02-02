export interface TableRowProps<T> {
  data: T;
  columns: {
    key: keyof T;
    header: string;
    width?: string;
    render?: (value: T[keyof T]) => React.ReactNode;
  }[];
  onRowClick?: (data: T) => void; // 새로 추가
}

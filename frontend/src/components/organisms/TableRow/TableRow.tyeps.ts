export interface TableRowProps<T> {
  data: T;
  columns: {
    key: keyof T;
    header: string;
    width?: string;
    render?: (value: any) => React.ReactNode;
  }[];
}

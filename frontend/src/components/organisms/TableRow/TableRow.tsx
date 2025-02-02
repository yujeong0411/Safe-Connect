import { TableRowProps } from '@components/organisms/TableRow/TableRow.tyeps.ts';

// 제네릭 타입 T를 사용하여 다양한 데이터 타입의 테이블 로우 생성 가능
const TableRow = <T,>({
  data, // 각 행에 표시될 데이터 객체
  columns = [], // 테이블의 컬럼 정의 배열,  기본값으로 빈 배열 설정,
  onRowClick,
}: TableRowProps<T>) => {
  // 컬럼이 없을 경우 null 반환
  if (!columns.length) return null;

  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(data);
    }
  };

  return (
    // 전체 행을 담는 컨테이너, 가로 너비 전체 사용, 상단 테두리 추가
    <div className="flex w-full border-t border-[#dde1e6]" onClick={handleRowClick}>
      {/* 각 컬럼을 순회하며 렌더링 */}
      {columns.map((column) => (
        <div key={String(column.key)} className="flex-1 p-4 text-sm">
          {/*
            컬럼에 커스텀 렌더링 함수가 있으면 해당 함수 사용,
            없으면 데이터를 문자열로 변환해서 표시.
            data[column.key]가 undefined일 경우 빈 문자열로 대체
            */}
          {column.render ? column.render(data[column.key]) : String(data[column.key] ?? '')}
        </div>
      ))}
    </div>
  );
};
export default TableRow;

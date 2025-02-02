import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

type ServiceType = 'report' | 'dispatch' | 'transfer' | null;

// 상태 카드 props 타입
interface StatCardProps {
  title: string;
  count: number;
  subText: string;
  type: ServiceType;
  isSelected: boolean;
  onClick: () => void;
}

// 상태 카드 컴포넌트
const StatCard = ({ title, count, subText, isSelected, onClick }: StatCardProps) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-lg cursor-pointer ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
  >
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-4xl font-bold mb-2">{count}</p>
    <p className="text-gray-500 text-sm">{subText}</p>
  </div>
);

const AdminServiceForm = () => {
  const [selectedType, setSelectedType] = useState<ServiceType>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // 카드 클릭 핸들러
  const handleCardClick = (type: ServiceType) => {
    setSelectedType(type === selectedType ? null : type);
  };

  // 각 타입별 컬럼 설정
  const getColumns = () => {
    switch (selectedType) {
      case 'report':
        return [
          { key: 'classification', header: '분류' },
          { key: 'reporterNumber', header: '신고자 번호' },
          { key: 'reportTime', header: '신고 일시' },
          { key: 'reportEndTime', header: '신고 종료 일시' },
          { key: 'dispatchStatus', header: '출동 여부' },
        ];
      case 'dispatch':
        return [
          { key: 'classification', header: '분류' },
          { key: 'fireStation', header: '관할 소방서' },
          { key: 'dispatchTime', header: '출동 일시' },
          { key: 'dispatchEndTime', header: '출동 종료 일시' },
          { key: 'transferStatus', header: '이송 여부' },
        ];
      case 'transfer':
        return [
          { key: 'classification', header: '분류' },
          { key: 'hospital', header: '이송 병원' },
          { key: 'transferRequestTime', header: '이송 요청 일시' },
          { key: 'transferCompletionTime', header: '이송 완료 일시' },
          { key: 'preKTAS', header: 'pre-KTAS' },
        ];
      default:
        return [
          { key: 'classification', header: '분류' },
          { key: 'requestTime', header: '요청 일시' },
          { key: 'endTime', header: '종료 일시' },
          { key: 'dispatchStatus', header: '출동 여부' },
          { key: 'transferStatus', header: '이송 여부' },
        ];
    }
  };

  // 카드 내용
  const stats: StatCardProps[] = [
    {
      type: 'report',
      title: '신고 현황',
      count: 128,
      subText: '오늘 신고 건수 12',
      isSelected: selectedType === 'report',
      onClick: () => handleCardClick('report'),
    },
    {
      type: 'dispatch',
      title: '출동 현황',
      count: 111,
      subText: '오늘 출동 건수 10',
      isSelected: selectedType === 'dispatch',
      onClick: () => handleCardClick('dispatch'),
    },
    {
      type: 'transfer',
      title: '이송 현황',
      count: 100,
      subText: '오늘 이송 건수 8',
      isSelected: selectedType === 'transfer',
      onClick: () => handleCardClick('transfer'),
    },
  ];

  const columns = getColumns();

  return (
    <div className="w-full">
      {/* 상태 카드 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.type} {...stat} />
        ))}
      </div>

      {/* 필터 영역 */}
      <div className="flex gap-4 items-center mb-6">
        <span>기간</span>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className="border p-2 rounded"
        />
        <span>~</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="border p-2 rounded"
        />
        <button className="px-4 py-2 rounded bg-banner text-white">검색</button>
      </div>

      {/* 테이블 */}
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-banner hover:bg-banner">
              {columns.map((column) => (
                <TableHead key={column.header} className="text-white font-medium">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminServiceForm;

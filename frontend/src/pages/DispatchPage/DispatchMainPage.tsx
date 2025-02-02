// DispatchMainPage.tsx
import { useState } from 'react';
import MainTemplate from '@components/templates/MainTemplate';
import TableRow from '@components/organisms/TableRow/TableRow';
import Pagination from '@components/atoms/Pagination/Pagination';
import Badge from '@components/atoms/Badge/Badge';
import Button from '@components/atoms/Button/Button';

interface EmergencyDispatch {
  requestTime: string;
  dispatchTime: string;
  transferType: string;
  arrivalTime: string;
  completeTime: string;
  statusInfo: string;
  patientInfo: string;
  videoCall: string;
}

const DispatchMainPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      key: 'requestTime',
      label: '출동 지령 일시',
    },
    {
      key: 'dispatchTime',
      label: '출동 일시',
    },
    {
      key: 'transferType',
      label: '이송 유무',
    },
    {
      key: 'arrivalTime',
      label: '이송 신청 일시',
    },
    {
      key: 'completeTime',
      label: '출동 종료 일시',
    },
    {
      key: 'statusInfo',
      label: '구조 상세정보',
      render: (value: string) => (
        <Button variant="gray" size="sm" onClick={() => console.log('상황보기 클릭')}>
          상황보기
        </Button>
      ),
    },
    {
      key: 'patientInfo',
      label: '환자 정보 작성',
      render: (value: string) => (
        <Button variant="gray" size="sm" onClick={() => console.log('작성하기 클릭')}>
          작성하기
        </Button>
      ),
    },
    {
      key: 'videoCall',
      label: '영상통화 연결',
      render: (value: string) => (
        <Button variant="gray" size="sm" onClick={() => console.log('영상통화 클릭')}>
          영상통화
        </Button>
      ),
    },
  ];

  const mockData: EmergencyDispatch = {
    requestTime: '2024-01-31 10:30',
    dispatchTime: '2024-01-31 10:32',
    transferType: '응급이송',
    arrivalTime: '2024-01-31 10:45',
    completeTime: '2024-01-31 11:15',
    statusInfo: '상황보기',
    patientInfo: '작성하기',
    videoCall: '영상통화',
  };

  return (
    <MainTemplate
      navItems={[
        { label: '출동 현황', path: '/dispatch/status' },
        { label: '환자 정보 작성', path: '/dispatch/patient' },
        { label: '이송 요청', path: '/dispatch/transfer' },
        { label: '보호자 알림', path: '/dispatch/guardian' },
      ]}
    >
      <div className="px-4 py-6 max-w-[1194px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">출동 현황</h1>
          <div className="flex gap-4">
            <Badge
              label="출동 대기 중"
              variant={isEmergency ? 'outline' : 'filled'}
              onClick={() => setIsEmergency(false)}
            />
            <Badge
              label="출동 중"
              variant={isEmergency ? 'filled' : 'outline'}
              onClick={() => setIsEmergency(true)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* 테이블 헤더 */}
          <div className="flex w-full bg-gray-100">
            {columns.map((column) => (
              <div key={String(column.key)} className="flex-1 p-4 font-medium text-sm">
                {column.label}
              </div>
            ))}
          </div>

          {/* 테이블 데이터 */}
          <TableRow<EmergencyDispatch> data={mockData} columns={columns} />
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={11} onPageChange={handlePageChange} />
        </div>
      </div>
    </MainTemplate>
  );
};

export default DispatchMainPage;

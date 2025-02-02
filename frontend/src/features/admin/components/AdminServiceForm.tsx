import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import Pagination from '@components/atoms/Pagination/Pagination.tsx';
import AdminReportDetailDialog from '@features/admin/components/AdminReportDetailDialog.tsx';
import AdminDispatchDetailDialog from '@features/admin/components/AdminDispatchDetailDialog.tsx';
import AdminTransferDetailDialog from '@features/admin/components/AdminTransferDetailDialog.tsx';
import { ReportDetailProps, DispatchDetailProps, TransferDetailProps } from '@features/admin/types/detailProps.types.ts';

// 테이블용 데이터 타입 정의
interface BaseTableData {
  classification: string;
}

interface ReportTableData extends BaseTableData {
  type: 'report';
  reporterNumber: string;
  reportTime: string;
  reportEndTime: string;
  dispatchStatus: boolean;
}

interface DispatchTableData extends BaseTableData {
  type: 'dispatch';
  fireStation: string;
  dispatchTime: string;
  dispatchEndTime: string;
  transferStatus: boolean;
}

interface TransferTableData extends BaseTableData {
  type: 'transfer';
  hospital: string;
  transferRequestTime: string;
  transferCompletionTime: string;
  preKTAS: number;
}

type ServiceType = 'report' | 'dispatch' | 'transfer' | null;

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

interface DetailData {
  type: ServiceType;
  [key: string]: any;
}

const AdminServiceForm = () => {
  // 상태를 관리하는 훅
  const [selectedType, setSelectedType] = useState<ServiceType>(null);
  const [selectedPatient, setSelectedPatient] = useState<DetailData | null>(null);
  // 날짜 필터링 관리
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 페이지네이션 관련 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // API에서 받아올 총 페이지 수

  // 각 타입별 컬럼 설정
  const getColumns = () => {
    switch (selectedType) {
      case 'report':
        return [
          { key: 'classification', header: '분류' },
          { key: 'reporterNumber', header: '신고자 번호' },
          { key: 'reportTime', header: '신고 일시' },
          { key: 'reportEndTime', header: '신고 종료 일시' },
          {
            key: 'dispatchStatus',
            header: '출동 여부',
            render: (value: boolean) => <span>{value ? '출동' : '미출동'}</span>,
          },
        ];
      case 'dispatch':
        return [
          { key: 'classification', header: '분류' },
          { key: 'fireStation', header: '관할 소방서' },
          { key: 'dispatchTime', header: '출동 일시' },
          { key: 'dispatchEndTime', header: '출동 종료 일시' },
          {
            key: 'transferStatus',
            header: '이송 여부',
            render: (value: boolean) => <span>{value ? '이송' : '미이송'}</span>,
          },
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
          {
            key: 'dispatchStatus',
            header: '출동 여부',
            render: (value: boolean) => <span>{value ? '출동' : '미출동'}</span>,
          },
          {
            key: 'transferStatus',
            header: '이송 여부',
            render: (value: boolean) => <span>{value ? '이송' : '미이송'}</span>,
          },
        ];
    }
  };

  // dummyData를 각 타입별로 수정
  const dummyData: DetailData[] = [
    {
      type: 'report', // 분류 정보 추가
      classification: '신고',
      reporterNumber: '123-4567',
      reportTime: '2025-01-19 14:30',
      reportEndTime: '2025-01-19 15:00',
      dispatchStatus: true,
    },
    {
      type: 'dispatch', // 분류 정보 추가
      classification: '출동',
      fireStation: '광산구 소방서',
      dispatchTime: '2025-01-19 14:30',
      dispatchEndTime: '2025-01-19 15:00',
      transferStatus: false,
    },
  ];

  const columns = getColumns();

  // 카트 내용
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

  // 카드 클릭 핸들러
  const handleCardClick = (type: ServiceType) => {
    // 같은 카드를 다시 클릭하면 선택 해제, 아니면 선택
    setSelectedType(type === selectedType ? null : type);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 여기서 새 페이지의 데이터를 불러오는 API 호출
    // fetchData(page);
  };


  const convertToModalData = (data: DetailData) => {
    switch (data.type) {
      case 'report':
        return {
          callerPhone: data.reporterNumber,
          callerIsUser: false,
          callIsDispatch: data.dispatchStatus,
          callStartAt: data.reportTime,
          callFinishAt: data.reportEndTime,
          callSummery: '',
          fireStaffName: ''
        };
      case 'dispatch':
        return {
          patient: '',
          callerPhone: data.fireStation,
          patientGender: '',
          patientAge: '',
          fireDept: data.fireStation,
          fireStaffName: '',
          dispatchCreateAt: data.dispatchTime,
          dispatchDepartAt: data.dispatchTime,
          dispatchArriveAt: data.dispatchEndTime,
          dispatchIsTransfer: data.transferStatus,
          callSummery: ''
        };
      case 'transfer':
        return {
          patient: '',
          patientGender: '',
          patientAge: '',
          preTKAS: data.preKTAS.toString(),
          fireDept: '',
          fireStaffName: '',
          transferRequestAt: data.transferRequestTime,
          transferAcceptAt: '',
          transferArriveAt: data.transferCompletionTime,
          hospitalName: true  // 이송 병원이 있으면 true
        };
      default:
        throw new Error('Unknown detail type');
    }
  };

  const renderModal = () => {
    if (!selectedPatient) return null;

    const modalData = convertToModalData(selectedPatient);

    switch (selectedPatient.type) {
      case 'report':
        return (
            <AdminReportDetailDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                data={modalData}
                buttons="확인"
            />
        );
      case 'dispatch':
        return (
            <AdminDispatchDetailDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                data={modalData}
                buttons="확인"
            />
        );
      case 'transfer':
        return (
            <AdminTransferDetailDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                data={modalData}
                buttons="확인"
            />
        );
      default:
        return null; // 알 수 없는 타입인 경우 아무것도 렌더링하지 않음
    }
  };


  // 디테일 모달
  const handleRowClick = (data: DetailData) => {
    setSelectedPatient(data);
    setIsModalOpen(true);
  };

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
            {dummyData.map((data, index) => (
              <TableRow key={index} onClick={() => handleRowClick(data)} className="cursor-pointer">
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {data[column.key] !== undefined && data[column.key] !== null
                      ? column.render
                        ? column.render(data[column.key])
                        : data[column.key]
                      : 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

        {/* 페이지네이션 추가 : 추후 수정*/}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {renderModal()}
        </div>




export default AdminServiceForm;

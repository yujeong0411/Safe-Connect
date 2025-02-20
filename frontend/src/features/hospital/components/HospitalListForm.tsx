import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import HospitalDetailDialog from '@features/hospital/components/HospitalDetailDialog';
import { PatientDetailProps } from '@features/hospital/types/patientDetail.types';
import { useState, useEffect, useMemo } from 'react';
import { useHospitalTransferStore } from '@/store/hospital/hospitalTransferStore';
import { CombinedTransfer } from '@/types/hospital/hospitalTransfer.types';
import { format } from 'date-fns';
import Pagination from "@components/atoms/Pagination/Pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface HospitalListFormProps {
  type: 'request' | 'accept';
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

interface Column {
  key: string;
  header: string;
  render?: (data: CombinedTransfer) => string;
}

const HospitalListForm = ({ type, isModalOpen, setIsModalOpen }: HospitalListFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPhone, setSearchPhone] = useState('');
  const { combinedTransfers, fetchCombinedTransfers } = useHospitalTransferStore();

  // 전화번호 검색 및 타입에 따른 필터링
  const displayData = useMemo(() => {
    if (!combinedTransfers) return [];

    let filtered = combinedTransfers;

    // 전화번호 검색 필터링
    if (searchPhone) {
      filtered = filtered.filter(item =>
        item.patients?.[0]?.patientPhone?.includes(searchPhone)
      );
    }

    // 타입에 따른 필터링
    filtered = type === 'accept'
      ? filtered.filter(item => item.transferAcceptAt)
        .sort((a, b) => {
          if(!a.transferArriveAt && b.transferArriveAt) return -1;
          if(a.transferArriveAt && !b.transferArriveAt) return 1;
          return new Date(b.transferAcceptAt!).getTime() - new Date(a.transferArriveAt!).getTime();
        })
      : filtered.filter(item => !item.transferAcceptAt && !item.dispatchTransferAccepted)
        .sort((a, b) => new Date(b.reqHospitalCreatedAt).getTime() - new Date(a.reqHospitalCreatedAt).getTime());

    return filtered;
  }, [combinedTransfers, type, searchPhone]);

  // 한 페이지당 항목 수
  const itemsPerPage = 10;
  const totalPages = Math.ceil(displayData.length / itemsPerPage);

  // 현재 페이지의 데이터
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayData.slice(startIndex, startIndex + itemsPerPage);
  }, [displayData, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 상세정보 상태 관리
  const [selectedPatient, setSelectedPatient] = useState<PatientDetailProps['data']>({
    dispatchId: 0,
    patientId: 0,
    name: null,
    gender: null,
    age: null,
    mental: '',
    preKTAS: '',
    sbp: 0,
    dbp: 0,
    pr: 0,
    bt: 0,
    spo2: 0,
    bst: 0,
    phone: '',
    protectorPhone: null,
    symptoms: '',
    requestTransferAt: '',
    transferAcceptAt: '',
    transferArriveAt: '',
  });

  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCombinedTransfers();
      } catch (error) {
        console.error("이송 데이터 로드 실패", error);
      }
    }
    void fetchData();
  }, []);

  // 테이블 행 클릭 핸들러
  const handleRowClick = async (data: CombinedTransfer) => {
    try {
      const detailData = await useHospitalTransferStore
        .getState()
        .fetchTransferDetail(data.dispatchId, type);

      setSelectedPatient({
        dispatchId: data.dispatchId,
        patientId: detailData.patientId,
        name: detailData.patientName ?? null,
        gender: detailData.patientGender ?? null,
        age: detailData.patientAge ?? null,
        mental: detailData.patientMental,
        preKTAS: detailData.patientPreKtas,
        sbp: detailData.patientSystolicBldPress,
        dbp: detailData.patientDiastolicBldPress,
        pr: detailData.patientPulseRate,
        bt: detailData.patientTemperature,
        spo2: detailData.patientSpo2,
        bst: detailData.patientBloodSugar,
        phone: detailData.patientPhone,
        protectorPhone: detailData.userProtectorPhone ?? null,
        symptoms: detailData.patientSymptom,
        diseases: detailData.patientDiseases?.join(', '),
        medications: detailData.patientMedications?.join(', '),
        requestTransferAt: format(new Date(data.reqHospitalCreatedAt), 'yyyy-MM-dd HH:mm:ss'),
        transferAcceptAt: data.transferAcceptAt
          ? format(new Date(data.transferAcceptAt), 'yyyy-MM-dd HH:mm:ss')
          : undefined,
        transferArriveAt: data.transferArriveAt
          ? format(new Date(data.transferArriveAt), 'yyyy-MM-dd HH:mm:ss')
          : undefined,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('상세 조회 실패:', error);
    }
  };

  // 모달 닫기 핸들러
  const handleModalClose = async (open: boolean) => {
    if (!open) {
      await fetchCombinedTransfers();
    }
    setIsModalOpen(false);
  };

  // 컬럼 정의
  const getColumns = (): Column[] => {
    const baseColumns = [
      {
        key: 'reqHospitalCreatedAt',
        header: '이송요청 일시',
        render: (data: CombinedTransfer) =>
          format(new Date(data.reqHospitalCreatedAt), 'yyyy-MM-dd HH:mm:ss')
      },
      {
        key: 'patientGender_Age',
        header: '성별/나이',
        render: (data: CombinedTransfer) => 
          data.patients?.[0]
            ? `${data.patients[0].patientGender}/${data.patients[0].patientAge}`
            : '-',
      },
      {
        key: 'preKtas',
        header: 'pre-KTAS',
        render: (data: CombinedTransfer) => data.patients?.[0]?.patientPreKtas || '-',
      },
      {
        key: 'patientPhone',
        header: '환자 연락처',
        render: (data: CombinedTransfer) => data.patients?.[0]?.patientPhone || '-',
      },
      {
        key: 'patientSymptom',
        header: '증상',
        render: (data: CombinedTransfer) => data.patients?.[0]?.patientSymptom || '-',
      },
      { key: 'fireDeptName', header: '관할 소방서' },
    ];

    if (type === 'accept') {
      return [
        ...baseColumns.slice(0, 1),
        {
          key: 'transferAcceptAt',
          header: '이송수락 일시',
          render: (data: CombinedTransfer) =>
            data.transferAcceptAt
              ? format(new Date(data.transferAcceptAt), 'yyyy-MM-dd HH:mm:ss')
              : '-',
        },
        ...baseColumns.slice(1),
        {
          key: 'dispatchIsTransfer',
          header: '이송 상태',
          render: (data: CombinedTransfer) =>
            data.transferArriveAt ? '이송 완료' : '이송 중',
        },
      ];
    }

    return baseColumns;
  };

  const columns = getColumns();

  // 검색 및 필터링 핸들러
  const handleSearch = () => {
    let filteredData = combinedTransfers.filter((transfer) => {
      const transferDate = new Date(transfer.reqHospitalCreatedAt);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;

      if (start && end) {
        return transferDate >= start && transferDate <= end;
      }
      return true;
    });

    filteredData = type === 'accept'
      ? filteredData.filter((item) => item.transferAcceptAt)
      : filteredData.filter((item) => !item.transferAcceptAt);

    useHospitalTransferStore.setState({ combinedTransfers: filteredData });
  };

  const handleReset = async () => {
    setDateRange({ start: '', end: '' });
    setSearchPhone('');
    try {
      await fetchCombinedTransfers();
    } catch (error) {
      console.error("초기화 중 데이터 로드 실패", error);
    }
  };

  return (
    <div className="w-full p-10 flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-2 text-gray-800">
        {type === 'request' ? '실시간 이송 요청' : '이송 수락 목록'}
      </h1>

      <div className="flex gap-2 items-center p-2 rounded-lg">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="환자 연락처 검색"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {type === 'accept' && (
          <>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="border border-gray-300 p-2 w-34 h-9 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-gray-500">~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="border border-gray-300 p-2 w-34 h-9 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </>
        )}

        <button onClick={handleSearch} className="px-4 py-1 rounded-md bg-banner text-white">
          조회
        </button>
        <button onClick={handleReset} className="px-4 py-1 rounded-md border bg-red-600 text-white">
          초기화
        </button>
      </div>

      {/* Table component remains the same */}
      <div className="bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 hover:bg-gray-200">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className="text-gray-700 font-semibold text-center px-6 py-3 uppercase tracking-wider text-base"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((data) => (
                <TableRow
                  key={data.dispatchId}
                  onClick={() => handleRowClick(data)}
                  className={`cursor-pointer transition-colors ${
                    type === 'accept' && !data.transferArriveAt
                      ? 'bg-red-400/50 hover:bg-pink-100'
                      : 'hover:bg-pink-100'
                  }`}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-3 py-3 text-gray-700 text-center">
                      {column.render
                        ? column.render(data)
                        : (data[column.key as keyof CombinedTransfer] as string)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-gray-500 py-4">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          siblingCount={1}
        />
      </div>

      <HospitalDetailDialog
        open={isModalOpen}
        onOpenChange={handleModalClose}
        data={selectedPatient}
      />
    </div>
  );
};

export default HospitalListForm;
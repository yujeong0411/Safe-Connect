import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import HospitalDetailDialog from '@features/hospital/components/HospitalDetailDialog.tsx';
import { PatientDetailProps } from '@features/hospital/types/patientDetail.types.ts';
import { useState, useEffect, useMemo } from 'react';
import { useHospitalTransferStore } from '@/store/hospital/hospitalTransferStore.tsx';
import {CombinedTransfer} from '@/types/hospital/hospitalTransfer.types.ts';
import { format } from 'date-fns';
import Pagination from "@components/atoms/Pagination/Pagination.tsx";

export interface HospitalListFormProps {
  type: 'request' | 'accept'; // 요청 목록인지 수락 목록인지 구분
}

interface Column {
  key: string;
  header: string;
  render?: (data: CombinedTransfer) => string;
}

const HospitalListForm = ({ type }: HospitalListFormProps) => {
  const [currentPage, setCurrentPage] = useState(1); // 페이지네이션
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {combinedTransfers, fetchCombinedTransfers} = useHospitalTransferStore();

  // 타입에 따라 데이터 필터링 및 정렬 필터링
  const displayData = combinedTransfers
    ? type === 'accept'
      ? combinedTransfers
              .filter((item) => item.transferAcceptAt) // 수락된 이송만, 객체 전체
              .sort((a, b) => {
                // 이송 상태로 1차 정렬 (이송 중이 위로 오게)
                if(!a.transferArriveAt && b.transferArriveAt) return -1;
                if(a.transferArriveAt && !b.transferArriveAt) return 1;
                // 이송 상태가 같으면 수락 시간으로 2차 정렬
                return new Date(b.transferAcceptAt!).getTime() - new Date(a.transferArriveAt!).getTime();
              })
      : combinedTransfers
              .filter((item) => !item.transferAcceptAt && !item.dispatchTransferAccepted) // 수락되지 않은 이송 및 다른 병원이 수락하지 않은 이송
              .sort((a, b) =>   // 요청시간으로 정렬
              new Date(b.reqHospitalCreatedAt).getTime() - new Date(a.reqHospitalCreatedAt).getTime())
      : [];

  // 한 페이지당 항목 수
  const itemsPerPage = 10;


  // 전체 페이지 수 (전체 항목 수/한 페이지당 수)
  const totalPages = Math.ceil(displayData.length / itemsPerPage);

  // 현재 페이지의 데이터만 필터링
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayData.slice(startIndex, startIndex + itemsPerPage);
  }, [displayData, currentPage]);

  // 페이지 변경
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [selectedPatient, setSelectedPatient] = useState<PatientDetailProps['data']>({
      patientId:0,
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
      transferAcceptAt:'',
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

  // 테이블 행 클릭 시
  const handleRowClick = async (data: CombinedTransfer) => {
    try {
      
      // 이미 다른 병원에서 수락한 경우
      if (data.dispatchTransferAccepted) {
        alert('이미 다른 병원에서 수락한 이송 요청입니다.')
        await  fetchCombinedTransfers();  // 목록 새로고침
        return
      }

      const detailData = await useHospitalTransferStore
        .getState()
        .fetchTransferDetail(data.dispatchId, type);
      console.log("상세 데이터:", detailData);
      setSelectedPatient({
        patientId:detailData.patientId,    // 현재 null로 들어옴.?? 해결??
        name: detailData.patientName ?? null,
        gender: detailData.patientGender ?? null,
        age: detailData.patientAge ?? null,
        mental: detailData.patientMental,
        preKTAS: detailData.patientPreKtas,  // 벡엔드 추가 완료
        sbp: detailData.patientSystolicBldPress,
        dbp: detailData.patientDiastolicBldPress,
        pr: detailData.patientPulseRate,
        bt: detailData.patientTemperature,
        spo2: detailData.patientSpo2,
        bst: detailData.patientBloodSugar,
        phone: detailData.userPhone,
        protectorPhone: detailData.userProtectorPhone ?? null,
        symptoms: detailData.patientSymptom,
        diseases: detailData.patientDiseases?.join(', ')?? undefined,
        medications: detailData.patientMedications?.join(', ')?? undefined,
        requestTransferAt: format(new Date(data.reqHospitalCreatedAt), 'yyyy-MM-dd HH:mm:ss'),
        transferAcceptAt: data.transferAcceptAt? format(new Date(data.transferAcceptAt), 'yyyy-MM-dd HH:mm:ss') : undefined,
        transferArriveAt: data.transferArriveAt? format(new Date(data.transferArriveAt), 'yyyy-MM-dd HH:mm:ss') : undefined,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('상세 조회 실패:', error);
    }
  };

  // 컬럼 정의
  const getColumns = (): Column[] => {
    if (type === 'request') {
      return [
        {
          key: 'reqHospitalCreatedAt',
          header: '이송요청 일시',
          render: (data: CombinedTransfer) =>
            format(new Date(data.reqHospitalCreatedAt), 'yyyy-MM-dd HH:mm:ss'),
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
          key: 'patientSymptom',
          header: '증상',
          render: (data: CombinedTransfer) => data.patients?.[0]?.patientSymptom || '-',
        },
        { key: 'fireDeptName', header: '관할 소방서' },
      ];
    }
    return [
      {
        key: 'reqHospitalCreatedAt',
        header: '이송요청 일시',
        render: (data: CombinedTransfer) =>
          format(new Date(data.reqHospitalCreatedAt), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        key: 'transferAcceptAt',
        header: '이송수락 일시',
        render: (data: CombinedTransfer) =>
            data.transferAcceptAt ? format(new Date(data.transferAcceptAt), 'yyyy-MM-dd HH:mm:ss')
        : '-',
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
        key: 'patientSymptom',
        header: '증상',
        render: (data: CombinedTransfer) => data.patients?.[0]?.patientSymptom || '-',
      },
      {
        key: 'dispatchIsTransfer',
        header: '이송 상태',
        render: (data: CombinedTransfer) => (data.transferArriveAt ? '이송 완료' : '이송 중'),
      },
      { key: 'fireDeptName', header: '관할 소방서' },
    ];
  };

  const columns = getColumns();

  // 날짜 필터링
  const handleSearch = () => {
    let filteredData = combinedTransfers.filter((transfer) => {
      const transferDate = new Date(transfer.reqHospitalCreatedAt);
      const start = dateRange.start ? new Date(dateRange.start) : null;
      const end = dateRange.end ? new Date(dateRange.end) : null;

      // 시작과 끝 날짜가 설정되었을 때
      if (start && end) {
        return transferDate >= start && transferDate <= end;
      }
      return true;
    });

    // 타입에 따라 다시 필터링
    filteredData =
      type === 'accept'
        ? filteredData.filter((item) => item.transferAcceptAt) // 수락된 이송만
        : filteredData.filter((item) => !item.transferAcceptAt); // 수락하지 않은 이송만

    useHospitalTransferStore.setState({combinedTransfers: filteredData });
  };

  // 초기화 버튼 핸들러
  const handleReset = async () => {
    setDateRange({start:'', end:''})
    try {
      await fetchCombinedTransfers(); // 🔄 데이터를 새로 불러옴
    } catch (error) {
      console.error("초기화 중 데이터 로드 실패", error);
    }
  }


  return (
      <div className="w-full p-10 flex flex-col h-screen ">
        <h1 className="text-xl font-bold mb-2 text-gray-800">
          {type === 'request' ? '실시간 이송 요청' : '이송 수락 목록'}
        </h1>

        {/* 필터 영역 : 수락 목록에만 보이게 수정*/}
        {type === 'accept' && (
        <div className="flex gap-2 items-center p-2 rounded-lg">
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
          <button onClick={handleSearch} className="px-4 py-1 rounded-md bg-banner text-white">
            조회
          </button>
          <button
              onClick={handleReset}
              className="px-4 py-1 rounded-md border bg-graybtn text-black"
          >
            초기화
          </button>
        </div>
        )}

        {/* 테이블 */}
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
                                  ? 'bg-red-400/50 hover:bg-pink-100'  // 수락 목록에서 이송 중인 경우
                                  : 'hover:bg-pink-100'  // 이송 완료 및 이송 수락 전 
                          }`}
                      >
                        {columns.map((column) => (
                            <TableCell key={column.key} className="px-3 py-3 text-gray-700 text-center ">
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
            onOpenChange={setIsModalOpen}
            data={selectedPatient}
            buttons="수락"
        />
      </div>
  );
};

export default HospitalListForm;

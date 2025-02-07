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
import { useState, useEffect } from 'react';
import { useHospitalTransferStore } from '@/store/hospital/hospitalTransferStore.tsx';
import {CombinedTransfer} from '@/types/hospital/hospitalTransfer.types.ts';
import { format } from 'date-fns';

export interface HospitalListFormProps {
  type: 'request' | 'accept'; // 요청 목록인지 수락 목록인지 구분
}

interface Column {
  key: string;
  header: string;
  render?: (data: CombinedTransfer) => string;
}

const HospitalListForm = ({ type }: HospitalListFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetailProps['data']>({
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
    });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const {combinedTransfers, fetchCombinedTransfers} = useHospitalTransferStore();

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

  // 타입에 따라 데이터 필터링
  const displayData = combinedTransfers
    ? type === 'accept'
      ? combinedTransfers.filter((item) => item.transferAcceptAt) // 수락된 이송만, 객체 전체
      : combinedTransfers.filter((item) => !item.transferAcceptAt) // 수락되지 않은 이송
    : [];


  // 테이블 행 클릭 시
  const handleRowClick = async (data: CombinedTransfer) => {
    try {
      const detailData = await useHospitalTransferStore
        .getState()
        .fetchTransferDetail(data.dispatchId, type);
      setSelectedPatient({
        name: detailData.patientName ?? null,
        gender: detailData.patientGender ?? null,
        age: detailData.patientAge ?? null,
        mental: detailData.patientMental,
        preKTAS: data.patients[0].patientPreKtas,
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
        { key: 'fireDeptName', header: '관할 소방서' },
        {
          key: 'patientSymptom',
          header: '증상',
          render: (data: CombinedTransfer) => data.patients?.[0]?.patientSymptom || '-',
        },
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
      { key: 'fireDeptName', header: '관할 소방서' },
      {
        key: 'dispatchIsTransfer',
        header: '이송 상태',
        render: (data: CombinedTransfer) => (data.dispatchIsTransfer ? '이송 중' : '대기 중'),
      },
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

    useHospitalTransferStore.setState({ transfers: filteredData, combinedTransfers: filteredData });
  };

  return (
    <div className="w-full p-10 ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {type === 'request' ? '실시간 이송 요청' : '이송 수락 목록'}
      </h1>

      {/* 필터 영역 */}
      <div className="flex gap-4 items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <span className="text-gray-500">~</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button onClick={handleSearch} className="px-4 py-2 rounded-md bg-banner text-white">
          조회
        </button>
        <button
          onClick={() => setDateRange({ start: '', end: '' })}
          className="px-4 py-2 rounded-md border bg-graybtn text-black"
        >
          초기화
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 hover:bg-gray-200">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className="text-gray-700 font-semibold text-left px-6 py-3 uppercase tracking-wider text-base"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length > 0 ? (
              displayData.map((data) => (
                <TableRow
                  key={data.dispatchId}
                  onClick={() => handleRowClick(data)}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-6 py-3 text-gray-700 text-left ">
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

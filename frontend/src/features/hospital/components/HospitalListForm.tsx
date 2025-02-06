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
import {useHospitalTransferStore} from "@/store/hospital/hospitalTransferStore.tsx";

export interface HospitalListFormProps {
  type: 'request' | 'accept';  // 요청 목록인지 수락 목록인지 구분
}

interface PatientData {
  name: string;
  id: string;
  fire: string;
  'sex/age': string;
  callStartAt: string;
  transferAcceptAt: string;
  'pre-KTAS': number;
  symptom: string;
}

const HospitalListForm = ({type}:HospitalListFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetailProps['data'] | undefined>(); // null 대신 undefined 전달
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const {transfers, fetchTransfers} = useHospitalTransferStore();

  useEffect(() => {
    fetchTransfers()
  }, [])

  // 테이블 행 클릭 시
  const handleRowClick = (patientData: PatientData) => {
    // PatientData를 PatientDetailProps['data'] 형식으로 변환
    setSelectedPatient({
      name: patientData.name,
      gender: patientData['sex/age'].split('/')[0],
      age: parseInt(patientData['sex/age'].split('/')[1]),
      mental: '',
      preKTAS: patientData['pre-KTAS'],
      contact: '',
      sbp: 0,
      dbp: 0,
      pr: 0,
      bt: 0,
      spo2: 0,
      bst: 0,
      phone: '',
      protectorPhone: '',
      symptoms: patientData.symptom,
      diseases: '',
      medications: '',
    });
    setIsModalOpen(true);
  };

  // 컬럼 정의
  const getColumns = () => {
    if (type === 'request') {
      return [
        { key: 'requestAt', header: '이송요청 일시' },
        { key: 'sex/age', header: '성별/나이' },
        { key: 'pre-KTAS', header: 'pre-KTAS' },
        { key: 'fireDeptName', header: '관할 소방서' },
        { key: 'transferAcceptAt', header: '요청수락 일시' },
      ]
    } else {
        return [
          { key: 'requestAt', header: '이송요청 일시' },
          { key: 'patientGender', header: '성별/나이' },
          { key: 'fireDeptId', header: '관할 소방서' },
          { key: 'transferAcceptAt', header: '수락 일시' },
          { key: 'transferIsComplete', header: '도착 여부' },
        ]
      }
  }

  const columns = getColumns();

  return (
      <div className="w-full p-10">
        <h1 className="text-[32px] font-bold mb-5">{
          type === 'request' ? '실시간 이송 요청' : '이송 수락 목록'
        }</h1>

        {/* 필터 영역 추가 */}
        <div className="flex gap-4 items-center mb-6 pt-4 px-10">
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
          <button
              onClick={() => fetchTransfers(1234)}
              className="px-4 py-2 rounded bg-banner text-white">검색</button>
        </div>


        {/* 테이블 */}
        <div className="w-full px-10">
          <Table>
            <TableHeader>
              <TableRow className="bg-graybtn  hover:bg-graybtn">
                {columns.map((column) => (
                    <TableHead key={column.header} className="text-black font-semibold">
                      {column.header}
                    </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.length > 0 ? (
                  transfers.map((data, index) => (
                      <TableRow
                          key={index}
                          onClick={() => handleRowClick(data)}
                          className="cursor-pointer bg-white hover:bg-[#FAF7F0]"
                      >
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                              {column.render ? column.render(data[column.key]) : data[column.key]}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
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

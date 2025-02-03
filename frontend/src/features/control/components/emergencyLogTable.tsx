import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { useState } from 'react';
import EmergencyDetailDialog from './EmergencyDetailDialog';
import { EmergencyDetailData } from '@/features/control/types/emergencyDetail.types';

interface EmergencyLogData {
  reportTime: string;
  processTime: string;
  dispatchTime: string;
  risk: string;
  id: string;
  name: string;
  gender: string;
  age: number;
  symptoms: string;
  currentDiseases: string;
  medications: string;
  patientPhone: string;
  protectorPhone: string;
}

const EmergencyLogTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyDetailData>();

  const columns = [
    { key: 'reportTime', header: '신고 일시' },
    { key: 'processTime', header: '신고 종료 일시' },
    { key: 'dispatchTime', header: '출동 일시' },
    { key: 'risk', header: '위험 유무' },
  ];

  const dummyData: EmergencyLogData[] = [
    {
      id: '1',
      reportTime: '2025-01-19 10:11',
      processTime: '2025-01-19 10:14',
      dispatchTime: '2025-01-19 10:15',
      risk: '위험',
      name: '최유정',
      gender: '여',
      age: 30,
      symptoms: '복통, 구토',
      currentDiseases: '고혈압',
      medications: '노바스크 정',
      patientPhone: '010-0000-0000',
      protectorPhone: '010-0000-0000',
    },
    // 추가 더미 데이터...
  ];

  const handleRowClick = (data: EmergencyLogData) => {
    setSelectedEmergency({
      name: data.name,
      gender: data.gender,
      age: data.age,
      reportTime: data.reportTime,
      processTime: data.processTime,
      dispatchTime: data.dispatchTime,
      symptoms: data.symptoms,
      currentDiseases: data.currentDiseases,
      medications: data.medications,
      patientPhone: data.patientPhone,
      protectorPhone: data.protectorPhone,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-banner hover:bg-banner">
            {columns.map((column) => (
              <TableHead key={column.key} className="text-white font-medium">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyData.map((data, index) => (
            <TableRow
              key={index}
              onClick={() => handleRowClick(data)}
              className="cursor-pointer hover:bg-gray-100"
            >
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {data[column.key as keyof EmergencyLogData]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EmergencyDetailDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedEmergency}
      />
    </div>
  );
};

export default EmergencyLogTable;
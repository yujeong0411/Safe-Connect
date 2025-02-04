import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table.tsx';
import { Button } from '@components/ui/button.tsx';
import CallDetailDialog from '@features/control/components/CallDetailDialog.tsx';

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

const CallDetailForm = () => {
  const [isEmergencyDetailOpen, setIsEmergencyDetailOpen] = React.useState(false);
  const [_selectedEmergency, setSelectedEmergency] = React.useState<EmergencyLogData | null>(null);

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
  ];

  const handleRowClick = (data: EmergencyLogData) => {
    setSelectedEmergency(data);
    setIsEmergencyDetailOpen(true);
  };
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">신고접수 목록</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">24시간 이내</span>
              <input type="checkbox" className="ml-2" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
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

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline">이전</Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button key={page} variant={page === 1 ? 'default' : 'outline'}>
                {page}
              </Button>
            ))}
            <Button variant="outline">다음</Button>
          </div>
        </div>
      </div>

      <CallDetailDialog open={isEmergencyDetailOpen} onOpenChange={setIsEmergencyDetailOpen} />
    </div>
  );
};

export default CallDetailForm;

import React from 'react';
import MainTemplate from '@/components/templates/MainTemplate';
import VideoCall from '@/components/organisms/VideoCall/VideoCall';
import TextArea from '@/components/atoms/TextArea/TextArea';
import Button from '@/components/atoms/Button/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import EmergencyDetailDialog from '@/features/control/components/EmergencyDetailDialog';
import { EmergencyDetailData } from '@/features/control/types/emergencyDetail.types';
import {useControlAuthStore} from "@/store/control/controlAuthStore.tsx";
import VideoCallCreateDialog from "@features/control/components/VideoCallCreateDialog.tsx";
import ProtectorNotifyDialog from "@features/control/components/ProtectorNotifyDialog.tsx";

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

const ControlLogPage = () => {
  const [reportText, setReportText] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);  // 출동 지령
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);  // 영상통화 생성 및 URL 전송
  const [isNotifyModalOpen, setIsNotifyModalOpen] = React.useState(false);  // 보호자 알림 전송
  const [selectedEmergency, setSelectedEmergency] = React.useState<EmergencyDetailData>();
  const {logout} = useControlAuthStore();


  const navItems = [
    { label: '영상통화 생성', path: '#', hasModal:true, onModalOpen: () => setIsVideoModalOpen(true) },
    { label: '신고 접수', path: '/Control/patient-info' },
    { label: '출동 지령', path: '/Control/dispatch' },
    { label: '보호자 알림', path: '#', hasModal: true, onModalOpen: () => setIsNotifyModalOpen(true) },
    { label: '신고 목록', path: '/Control/logs' },
  ];

  const handleSaveReport = () => {
    console.log('Save report:', reportText);
  };

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
    <MainTemplate navItems={navItems} logoutDirect={logout}>
      <div className="grid grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <VideoCall />
          <div>
            <h3 className="text-lg font-semibold mb-2">신고 내용</h3>
            <TextArea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="신고 내용을 입력하세요..."
              className="mb-2"
            />
            <Button
              variant="blue"
              size="md"
              width="auto"
              onClick={handleSaveReport}
            >
              저장
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">신고접수 목록</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">24시간 이내</span>
              <input type="checkbox" className="ml-2 accent-[#545f71]" />
            </div>
          </div>

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

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="gray" size="sm" width="auto">이전</Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? 'blue' : 'gray'}
                size="sm"
                width="auto"
              >
                {page}
              </Button>
            ))}
            <Button variant="gray" size="sm" width="auto">다음</Button>
          </div>
        </div>
      </div>

      <EmergencyDetailDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedEmergency}
      />
      <VideoCallCreateDialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}/>
      <ProtectorNotifyDialog open={isNotifyModalOpen} onOpenChange={setIsNotifyModalOpen}/>
    </MainTemplate>
  );
};

export default ControlLogPage;
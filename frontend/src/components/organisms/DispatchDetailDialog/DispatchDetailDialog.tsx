// src/components/organisms/DispatchDetailDialog/DispatchDetailDialog.tsx
import Dialog from '@/components/molecules/Alert/Alert';
import { DispatchDetailDialogProps } from './DispatchDetailDialog.types';

const DispatchDetailDialog = ({
  isOpen,
  onClose,
  patientInfo,
  vitalSigns,

  transferInfo,
}: DispatchDetailDialogProps) => {
  return (
    <Dialog
      title="이송 상세정보"
      isOpen={isOpen}
      onClose={onClose}
      buttons={[
        {
          text: '닫기',
          variant: 'gray',
          onClick: onClose,
        },
      ]}
    >
      <div className="w-[800px] max-h-[80vh] overflow-y-auto">
        {/* 환자 기본 정보 */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="col-span-6 text-lg font-bold mb-2">기본 정보</div>
          <div className="space-y-2">
            <div className="font-medium">이름</div>
            <div className="bg-gray-50 p-2 rounded">{patientInfo.name}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">성별</div>
            <div className="bg-gray-50 p-2 rounded">{patientInfo.gender}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">나이</div>
            <div className="bg-gray-50 p-2 rounded">{patientInfo.age}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">의식상태</div>
            <div className="bg-gray-50 p-2 rounded">{patientInfo.consciousness}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">pre-KTAS</div>
            <div className="bg-gray-50 p-2 rounded text-red-500">{patientInfo.preKTAS}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">환자 연락처</div>
            <div className="bg-gray-50 p-2 rounded">{patientInfo.patientPhone}</div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          <div className="col-span-7 text-lg font-bold mb-2">Vital Signs</div>
          <div className="space-y-2">
            <div className="font-medium">SBP</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.sbp}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">DBP</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.dbp}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">RR</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.rr}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">BT</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.bt}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">SPO2</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.spo2}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">BST</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.bst}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">보호자 연락처</div>
            <div className="bg-gray-50 p-2 rounded">{vitalSigns.guardianPhone}</div>
          </div>
        </div>

        {/* 증상 및 위치 정보 */}
        <div className="space-y-4 mb-6">
          <div className="text-lg font-bold">환자 정보</div>
          <div className="space-y-2">
            <div className="font-medium">증상</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.symptoms}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">복통, 구토</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.location}</div>
          </div>
        </div>

        {/* 현재 병력 */}
        <div className="space-y-4 mb-6">
          <div className="text-lg font-bold">현재 병력</div>
          <div className="space-y-2">
            <div className="font-medium">진단명</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.diagnosis}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">복용 약물</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.medication}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">노바스크정</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.notes}</div>
          </div>
        </div>

        {/* 이송 정보 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3 text-lg font-bold mb-2">이송 정보</div>
          <div className="space-y-2">
            <div className="font-medium">이송 요청 일시</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.requestTime}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">이송 종료 일시</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.completeTime}</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">이송 병원</div>
            <div className="bg-gray-50 p-2 rounded">{transferInfo.transferDate}</div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DispatchDetailDialog;

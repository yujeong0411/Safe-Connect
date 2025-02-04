import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { CallInfo } from '@types/common/Patient.types.ts';
import { patientService } from '@features/control/services/controlApiService.ts';
import { usePatientStore } from '@/store/control/PatientStore.tsx';
import { useState } from 'react';

const ControlPatientInfoForm = () => {
  const { patientInfo, isLoading, error, searchByPhone, savePatientInfo } = usePatientStore();
  const [callInfo, setCallInfo] = useState<CallInfo>({
    callId: 0,
    callText: '',
    callSummary: '',
    callIsDispatch: false,
  });

  // 전화번호 검색
  const handleSearch = async (phone: string) => {
    await searchByPhone(phone);
  };

  // 입력
  const handleChange = (key: keyof CallInfo, value: string | boolean) => {
    setCallInfo((prev) => ({ ...prev, [key]: value }));
  };

  // 저장
  const handleSubmit = async () => {
    savePatientInfo(callInfo);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex-1 p-4 max-w-4xl">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <SearchBar_ver2 placeholder="환자 전화번호" buttonText="조회" onSearch={handleSearch} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input className="w-full" value={patientInfo?.userName} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <Input className="w-full" value={patientInfo?.userGender} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <Input className="w-full" value={patientInfo?.userAge} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <Input className="w-full" value={patientInfo?.userPhone} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">보호자 연락처</label>
              <Input className="w-full" value={patientInfo?.userProtectorPhone} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 병력</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={
                  patientInfo?.mediInfo
                    .find((m) => m.categoryName === '기저질환')
                    ?.mediList.map((m) => m.mediName)
                    .join(',') || ''
                }
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">복용 약물</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none
                focus:ring-2 focus:ring-blue-200"
                value={
                  patientInfo?.mediInfo
                    .find((m) => m.categoryName === '복용약물')
                    ?.mediList.map((m) => m.mediName)
                    .join(',') || ''
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">증상</label>
              <textarea className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">요약본</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="요청사항을 입력하세요"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="button" variant="blue" width="sm" onClick={handleSubmit}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPatientInfoForm;

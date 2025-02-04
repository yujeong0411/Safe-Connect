import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { usePatientStore } from '@/store/control/PatientStore.tsx';
import React, { useState } from 'react';
import { useEffect } from 'react';

interface SaveForm {
  userName: string;
  userGender: string;
  userAge: string;
  userPhone: string;
  userProtectorPhone: string;
  diseases: string;
  medications: string;
  callSummary: string;
}

const ControlPatientInfoForm = () => {
  const { patientInfo, searchByPhone, savePatientInfo } = usePatientStore();

  // 폼 데이터 상태
  const [formData, setFormData] = useState<SaveForm>({
    userName: '',
    userGender: '',
    userAge: '',
    userPhone: '',
    userProtectorPhone: '',
    diseases: '',
    medications: '',
    callSummary: '',
  });

  // patientInfo가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (patientInfo) {
      setFormData((prev) => ({
        ...prev, // 기존 요약본 등 유지
        userName: patientInfo.userName || '',
        userGender: patientInfo.userGender || '',
        userAge: patientInfo.userAge?.toString() || '',
        userPhone: patientInfo.userPhone ? formatPhoneNumber(patientInfo.userPhone) : '',
        userProtectorPhone: patientInfo.userProtectorPhone
          ? formatPhoneNumber(patientInfo.userProtectorPhone)
          : '',
        diseases:
          patientInfo?.mediInfo
            .find((m) => m.categoryName === '기저질환')
            ?.mediList.map((m) => m.mediName)
            .join(',') || '',
        medications:
          patientInfo?.mediInfo
            .find((m) => m.categoryName === '복용약물')
            ?.mediList.map((m) => m.mediName)
            .join(', ') || '',
      }));
    }
  }, [patientInfo]);

  // AI 요약본 업데이트 함수
  const updateAiSummary = (summary: string) => {
    setFormData((prev) => ({
      ...prev,
      callSummary: summary,
    }));
  };

  // 전화번호 검색
  const handleSearch = async (phone: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone).replace(/-/g, '');
      const response = await searchByPhone(formattedPhone);

      if (!response?.isSuccess) {
        // 명시적인 오류 메시지 표시
        alert(response?.message || '환자 정보를 찾을 수 없습니다.');

        setFormData((prev) => ({
          ...prev,
          userPhone: formatPhoneNumber(formattedPhone),
        }));
      }
    } catch (error) {
      // 네트워크 오류 등 처리
      console.error('환자 검색 중 오류 발생:', error);
      alert('환자 정보 조회에 실패했습니다.');
    }
  };
  // 필드 변경 핸들러
  const handleInputChange =
    (name: keyof SaveForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      console.log('Original value:', value); // 입력값 로깅

      let processedValue = value;

      if (name === 'userPhone' || name === 'userProtectorPhone') {
        processedValue = formatPhoneNumber(value);
        console.log('Processed value:', processedValue); // 포맷된 값 로깅
      }

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    };

  // 저장 핸들러
  const handleSubmit = async () => {
    await savePatientInfo(formData);
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
              <Input
                className="w-full"
                value={patientInfo?.userName}
                onChange={handleInputChange('userName')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <Input
                className="w-full"
                value={patientInfo?.userGender}
                onChange={handleInputChange('userGender')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <Input
                className="w-full"
                value={patientInfo?.userAge}
                onChange={handleInputChange('userAge')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <Input
                className="w-full"
                value={patientInfo?.userPhone ? formatPhoneNumber(patientInfo.userPhone) : ''}
                onChange={handleInputChange('userPhone')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">보호자 연락처</label>
              <Input
                className="w-full"
                value={
                  patientInfo?.userProtectorPhone
                    ? formatPhoneNumber(patientInfo.userProtectorPhone)
                    : ''
                }
                onChange={handleInputChange('userProtectorPhone')}
              />
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
                onChange={handleInputChange('medications')}
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
                onChange={handleInputChange('medications')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">요약본</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={handleInputChange('callSummary')}
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

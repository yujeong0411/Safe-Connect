import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { usePatientStore } from '@/store/control/patientStore.tsx';
import { FormData } from '@/types/common/Patient.types.ts';
import React from 'react';
import { useEffect } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';

const ControlPatientInfoForm = () => {
  const { patientInfo, formData, updateFormData, searchByPhone, savePatientInfo } =
    usePatientStore();
  const { callId, callerPhone } = useOpenViduStore();

  // 영상통화 생성 시 전화번도 자동 검색
  useEffect(() => {
    console.log('Caller Phone changed:', callerPhone);
    if (callerPhone) {
      handleSearch(callerPhone);
    }
  }, [callerPhone]);

  // patientInfo가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (patientInfo) {
      updateFormData({
        userName: patientInfo.userName || '',
        userGender: patientInfo.userGender || '',
        userAge: patientInfo.userAge?.toString() || '',
        userPhone: patientInfo.userPhone ? formatPhoneNumber(patientInfo.userPhone) : '',
        userProtectorPhone: patientInfo.userProtectorPhone
          ? formatPhoneNumber(patientInfo.userProtectorPhone)
          : '',
        diseases: patientInfo?.mediInfo
          ? patientInfo.mediInfo
              .find((m) => m.categoryName === '기저질환')
              ?.mediList.map((m) => m.mediName)
              .join(',') || ''
          : '',
        medications: patientInfo?.mediInfo
          ? patientInfo.mediInfo
              .find((m) => m.categoryName === '복용약물')
              ?.mediList.map((m) => m.mediName)
              .join(', ') || ''
          : '',
      });
    }
  }, [patientInfo]);

  // 전화번호 검색
  const handleSearch = async (phone: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const response = await searchByPhone(formattedPhone);

      if (!response?.isSuccess) {
        // 명시적인 오류 메시지 표시
        alert(response?.message || '환자 정보를 찾을 수 없습니다.');
        updateFormData({ userPhone: formattedPhone });
      }
    } catch (error) {
      // 네트워크 오류 등 처리
      console.error('환자 검색 중 오류 발생:', error);
      alert('환자 정보 조회에 실패했습니다.');
    }
  };

  // 필드 변경 핸들러
  const handleInputChange =
    (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      console.log('Original value:', value); // 입력값 로깅

      let processedValue = value;

      if (name === 'userPhone' || name === 'userProtectorPhone') {
        processedValue = formatPhoneNumber(value);
        console.log('Processed value:', processedValue); // 포맷된 값 로깅
      }

      updateFormData({
        [name]: processedValue,
      });
    };

  // 저장 핸들러
  const handleSubmit = async () => {
    await savePatientInfo(callId || 0);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex-1 p-4 max-w-4xl">
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-[9fr_1fr] gap-4 mb-4">
              <SearchBar_ver2
                placeholder="환자 전화번호"
                buttonText="조회"
                formatValue={formatPhoneNumber}
                onSearch={handleSearch}
              />
            <Button
              type="button"
              variant="gray"
              onClick={() => {
                if (window.confirm('입력된 모든 정보가 초기화됩니다. 계속하시겠습니까?')) {
                  usePatientStore.getState().resetPatientInfo();
                }
              }}
            >
              초기화
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input
                className="w-full border-gray-400"
                value={formData.userName}
                onChange={handleInputChange('userName')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <Input
                className="w-full border-gray-400"
                value={formData.userGender}
                onChange={handleInputChange('userGender')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <Input
                className="w-full border-gray-400"
                value={formData.userAge}
                onChange={handleInputChange('userAge')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <Input
                className="w-full border-gray-400"
                value={formData.userPhone ? formatPhoneNumber(formData.userPhone) : ''}
                onChange={handleInputChange('userPhone')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">보호자 연락처</label>
              <Input
                className="w-full border-gray-400"
                value={
                  formData.userProtectorPhone ? formatPhoneNumber(formData.userProtectorPhone) : ''
                }
                onChange={handleInputChange('userProtectorPhone')}
              />
            </div>
          </div>

          <div className="col-span-1 mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">증상</label>
            <Input
              className="w-full border-gray-400"
              value={formData.symptom}
              onChange={handleInputChange('symptom')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 병력</label>
              <textarea
                className="w-full h-25 p-3 border border-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={
                  patientInfo?.mediInfo
                    ? patientInfo.mediInfo
                        .find((m) => m.categoryName === '기저질환')
                        ?.mediList.map((m) => m.mediName)
                        .join(',')
                    : ''
                }
                onChange={handleInputChange('medications')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">복용 약물</label>
              <textarea
                className="w-full h-25 p-3 border border-gray-400 rounded-md resize-none focus:outline-none
                focus:ring-2 focus:ring-blue-200"
                value={
                  patientInfo?.mediInfo
                    ? patientInfo.mediInfo
                        .find((m) => m.categoryName === '복용약물')
                        ?.mediList.map((m) => m.mediName)
                        .join(',')
                    : ''
                }
                onChange={handleInputChange('medications')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">요약본</label>
              <textarea
                className="w-full h-32 p-3 border border-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                // value={`${formData.callSummary}\n\n${formData.addSummary}`}
                value={`${formData.callSummary}${formData.callSummary && formData.addSummary ? '\n\n' : ''}${formData.addSummary}`}
                onChange={(e) => {
                  const totalValue = e.target.value;
                  // ai 요약본과 추가 텍스트 입력 가능
                  const callSummaryNewLine = formData.callSummary
                    ? formData.addSummary + '\n\n'
                    : '';
                  const newAddSummary = totalValue.replace(callSummaryNewLine, '');
                  updateFormData({ addSummary: newAddSummary });
                }}
                placeholder="추가 내용을 입력하세요."
              />
            </div>
          </div>

          <div className="flex justify-end mt-3">
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

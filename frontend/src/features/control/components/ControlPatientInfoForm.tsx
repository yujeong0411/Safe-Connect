import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';
import { SearchBarRef } from '@components/molecules/SearchBar/SearchBar.types.ts';
import Input from '@components/atoms/Input/Input.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { usePatientStore } from '@/store/control/patientStore.tsx';
import { FormData } from '@/types/common/Patient.types.ts';
import React, { useState, useEffect, useRef } from 'react';
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import ConfirmDialog from '@components/organisms/ConfirmDialog/ConfirmDialog.tsx';
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { CircleCheckBig, CircleAlert } from 'lucide-react';

const ControlPatientInfoForm = () => {
  const { patientInfo, formData, updateFormData, searchByPhone, savePatientInfo } =
    usePatientStore();
  const { callId, callerPhone } = useOpenViduStore();
  const genderOptions = ['M', 'F'];
  const searchBarRef = useRef<SearchBarRef>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive' | 'info' | 'warning' | 'success',
  });

  // 알림창 표시 핸들러
  const handleAlertClose = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  // 영상통화 생성 시 전화번호 자동 검색
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

      if (response?.isSuccess) {
        // 명시적인 오류 메시지 표시
        handleAlertClose({
          title: '신고자 조회 성공',
          description: '회원이 조회되었습니다.',
          type: 'default',
        });
        updateFormData({ userPhone: formattedPhone });
      } else {
        handleAlertClose({
          title: '미가입자 조회',
          description: '등록된 회원이 아닙니다.',
          type: 'info',
        });
          updateFormData({ userPhone: formattedPhone });
      }
    } catch (error) {
      // 네트워크 오류 등 처리
      console.error('환자 검색 중 오류 발생:', error);
    }
  };

  // 필드 변경 핸들러
  const handleInputChange =
    (name: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!callId) {
      handleAlertClose({
        title: '신고 없음',
        description: '현재 신고가 업습니다.',
        type: 'destructive',
      });
      return;
    }
    await savePatientInfo(callId || 0);
    handleAlertClose({
      title: '저장 성공',
      description: '저장되었습니다.',
      type: 'default',
    });
  };

  // 초기화
  const handleReset = () => {
    // 스토어 초기화
    usePatientStore.getState().resetPatientInfo();

    // searchbar 초기화
    searchBarRef.current?.reset();
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex-1 p-4 max-w-4xl">
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-[9fr_1fr] gap-4 mb-4">
            <SearchBar_ver2
              ref={searchBarRef}
              placeholder="환자 전화번호"
              buttonText="조회"
              formatValue={formatPhoneNumber}
              onSearch={handleSearch}
            />
            <ConfirmDialog
              trigger="초기화"
              title="정보 초기화"
              description="입력된 모든 정보가 초기화됩니다. 계속하시겠습니까?"
              confirmText="초기화"
              triggerVariant="gray"
              cancelVariant="gray"
              confirmVariant="destructive"
              onConfirm={handleReset}
              className="min-w-20 min-h-[2.6rem] text-base"  // 트리거 버튼
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input
                className="w-full border-gray-800"
                value={formData.userName}
                onChange={handleInputChange('userName')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">성별</label>
              <select
                value={formData.userGender}
                onChange={handleInputChange('userGender')}
                name="patientGender"
                className=" w-full px-3 py-[0.85rem] border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <Input
                className="w-full border-gray-800"
                value={formData.userAge}
                onChange={handleInputChange('userAge')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <Input
                className="w-full border-gray-800"
                value={formData.userPhone ? formatPhoneNumber(formData.userPhone) : ''}
                onChange={handleInputChange('userPhone')}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">보호자 연락처</label>
              <Input
                className="w-full border-gray-800"
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
              className="w-full border-gray-800"
              value={formData.symptom}
              onChange={handleInputChange('symptom')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-800 mb-1">현재 병력</label>
              <textarea
                className="w-full h-25 p-3 border border-gray-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                className="w-full h-25 p-3 border border-gray-800 rounded-md resize-none focus:outline-none
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
                className="w-full h-32 p-3 border border-gray-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
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
      {showAlert && (
        <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[999]">
          <Alert
            variant={alertConfig.type}
            className="w-[400px] shadow-lg bg-white"
          >
            {alertConfig.type === 'default' ? (
              <CircleCheckBig className="h-6 w-6" />
            ) : (
              <CircleAlert className="h-6 w-6" />
            )}
            <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
            <AlertDescription className="text-base m-2">{alertConfig.description}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ControlPatientInfoForm;

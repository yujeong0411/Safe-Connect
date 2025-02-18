import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';
import { SearchBarRef } from '@components/molecules/SearchBar/SearchBar.types.ts';
import Input from '@components/atoms/Input/Input.tsx';
import Button from '@components/atoms/Button/Button.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { usePatientStore } from '@/store/control/patientStore.tsx';
import { FormData } from '@/types/common/Patient.types.ts';
import React, { useState, useEffect, useRef } from 'react';
import {useNavigate} from "react-router-dom";
import { useOpenViduStore } from '@/store/openvidu/OpenViduStore.tsx';
import ConfirmDialog from '@components/organisms/ConfirmDialog/ConfirmDialog.tsx';
import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert.tsx';
import { CircleCheckBig, CircleAlert } from 'lucide-react';

const ControlPatientInfoForm = () => {
  const {
    patientInfo, formData, updateFormData,
    searchByPhone, savePatientInfo,resetPatientInfo2
  } =usePatientStore();
  const { callId, callerPhone } = useOpenViduStore();
  const genderOptions = ['M', 'F'];
  const navigate = useNavigate();
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
      resetPatientInfo2();
      const response = await searchByPhone(formattedPhone);
      if (response?.isSuccess) {
        updateFormData({ userPhone: formattedPhone });
      } else {
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
        description: '현재 신고가 없습니다.',
        type: 'destructive',
      });
      return;
    }
    try {
    await savePatientInfo(callId || 0);
    handleAlertClose({
      title: '저장 성공',
      description: '저장되었습니다.',
      type: 'default',
    });
    // 출동 지령 페이지로 이동
    setTimeout(() => {
      navigate('/control/dispatch-order')
    }, 1000)
    } catch (error) {
      handleAlertClose({
        title: '저장 실패',
        description: '저장에 실패했습니다.',
        type: 'destructive',
      });
    }
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
                value={`${formData.callSummary}${formData.callSummary && formData.addSummary ? '\n' : ''}${formData.addSummary}`}
                onChange={(e) => {
                  const totalValue = e.target.value;
                  // callSummary 부분을 제외한 나머지를 addSummary로 설정
                  if (formData.callSummary) {
                    // 줄바꿈을 포함한 AI 요약본 부분을 찾아서 제거
                    const summaryPart = formData.callSummary + (formData.addSummary ? '\n' : '');
                    const newAddSummary = totalValue.replace(summaryPart, '');
                    updateFormData({ addSummary: newAddSummary });
                  } else {
                    // AI 요약본이 없는 경우 전체를 추가 요약본으로 설정
                    updateFormData({ addSummary: totalValue });
                  }
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

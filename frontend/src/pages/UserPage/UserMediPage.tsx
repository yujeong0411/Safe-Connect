import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import mediImg from '@assets/image/mediImg.png';
import SignupMediForm from '@features/auth/components/SignupMediForm.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useEffect, useState } from 'react';
import { useLoadUserInfo } from '@/hooks/useLoadUserInfo.ts';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleCheckBig, CircleAlert } from "lucide-react";
// import { signOut } from '@features/auth/servies/apiService.ts';

const UserMediPage = () => {
  const { updateMediInfo, logout } = useAuthStore();
  const { formData, setFormData } = useSignupStore();
  const { loadUserInfo } = useLoadUserInfo('medi'); // 사용자 정보 가져오기
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });

  // Alert 표시 핸들러
  const handleShowAlert = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // 3초 후 알림 닫기
  };

  useEffect(() => {
    (async () => {
      await initializePage();
    })();
  }, []); // 페이지 마운트 시 한 번만 실행

  const initializePage = async () => {
    try {
      const userMediInfo: { categoryName: string; mediList: { mediId: number }[] }[] | null =
        await loadUserInfo();
      if (userMediInfo) {
        // mediList 내의 ID들을 찾아서 변환
        const diseaseIds =
          userMediInfo
            .find((item: { categoryName: string }) => item.categoryName === '기저질환')
            ?.mediList.map((medi: { mediId: number }) => medi.mediId) || [];

        const medicationIds =
          userMediInfo
            .find((item: { categoryName: string }) => item.categoryName === '복용약물')
            ?.mediList.map((medi: { mediId: number }) => medi.mediId) || [];

        // 함수형 업데이트가 아닌 객체를 직접 전달
        setFormData({
          ...formData, // 기존 formData 유지
          diseaseId: diseaseIds,
          medicationId: medicationIds,
        });
      }
      // 업데이트 후 상태 확인
      } catch (error) {
      console.error('사용자 의료 정보 로드 실패:', error);
    }
  };

  // 저장 핸들
  const handleSave = async () => {
    try {
      const mediIds = [...(formData.diseaseId || []), ...(formData.medicationId || [])];

      // PUT만 사용
      await updateMediInfo({ mediIds });
      await loadUserInfo(); // 갱신된 데이터 다시 로드
      handleShowAlert({
        title: '저장 완료',
        description: '의료 정보가 저장되었습니다.',
        type: 'default',
      });
    } catch (error) {
      console.error('저장 실패:', error);
      handleShowAlert({
        title: '저장 실패',
        description: '의료 정보 저장에 실패했습니다.',
        type: 'destructive',
      });
    }
  };

  return (
      <>
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
      logoutDirect={logout}
    >
      <UserInfoTemplate
        title="의료 정보 수정"
        content="귀하의 건강 정보는 응급 상황에서 119구급대원과 응급실 의료진이 즉시 확인하여 적절한 응급 처치를 제공하는 데 사용됩니다.
현재 질환과 복용 약물을 입력해 주세요."
        logoSrc={mediImg}
        primaryButtonOnClick={handleSave}
      >
        <SignupMediForm />
      </UserInfoTemplate>
    </MainTemplate>

  {showAlert && (
      <div className="fixed left-1/2 top-80 -translate-x-1/2 z-[9999]">
        <Alert
            variant={alertConfig.type}
            className={`w-[400px] shadow-lg bg-white ${
                alertConfig.type === 'default'
                    ? '[&>svg]:text-blue-600 text-blue-600'
                    : '[&>svg]:text-red-500 text-red-500'
            }`}
        >
          {alertConfig.type === 'default' ? (
              <CircleCheckBig className="h-6 w-6" />
          ) : (
              <CircleAlert className="h-6 w-6" />
          )}
          <AlertTitle className="text-xl ml-4 font-sans">{alertConfig.title}</AlertTitle>
          <AlertDescription className="text-base m-2 font-sans">
            {alertConfig.description}
          </AlertDescription>
        </Alert>
      </div>
  )}
</>
  );
};

export default UserMediPage;

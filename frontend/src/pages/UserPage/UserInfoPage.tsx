import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import userImg from '@assets/image/userImg.png';
import UserInfoForm from '@features/user/components/UserInfoForm.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import { useLoadUserInfo } from '@/hooks/useLoadUserInfo.ts';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleCheckBig, CircleAlert } from "lucide-react";
import {signOut} from "@features/auth/servies/apiService.ts";

const UserInfoPage = () => {
  const navigate = useNavigate();
  const { loadUserInfo } = useLoadUserInfo('user');
  const { updateUserInfo, logout } = useAuthStore();
  const { formData, validateFields } = useSignupStore();
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
    }, 3000);
  };


  // 정보 가져오기
  useEffect(() => {
    loadUserInfo();
  }, []);

  // 정보 저장 핸들러
  const handleSave = async () => {
    // 유효성 검사
    const phoneError = validateFields('userPhone', formData.userPhone);
    // 필수가 아니므로 있을때만 유효성 검사 시행
    const protectorPhoneError = formData.userProtectorPhone
      ? validateFields('userProtectorPhone', formData.userProtectorPhone)
      : '';

    // 에러가 있으면 저장 안함.
    if (phoneError || protectorPhoneError) {
      const errors = [];
      if (phoneError) errors.push(phoneError);
      if (protectorPhoneError) errors.push(protectorPhoneError);

      handleShowAlert({
        title: '입력 오류',
        description: errors.join('\n'),
        type: 'destructive',
      });
      return;
    }

    try {
      await updateUserInfo({
        userPhone: formData.userPhone,
        userProtectorPhone: formData.userProtectorPhone,
      });
      handleShowAlert({
        title: '저장 완료',
        description: '개인정보가 저장되었습니다.',
        type: 'default',
      });
    } catch (error) {
      handleShowAlert({
        title: '저장 실패',
        description: '개인정보 저장에 실패했습니다.',
        type: 'destructive',
      });
    }
  };

  // 회원탈퇴 핸들러
  const handleSignout = async () => {
    try {
      await signOut(navigate)
      handleShowAlert({
        title: '회원 탈퇴 완료',
        description: '회원 탈퇴가 완료되었습니다.',
        type: 'default',
      });
    } catch (error) {
      handleShowAlert({
        title: '회원 탈퇴 실패',
        description: '회원 탈퇴에 실패했습니다.',
        type: 'destructive',
      });
    }
  };

  return (
      <>
        {/*<ConfirmDialog*/}
        {/*    trigger="회원 탈퇴"*/}
        {/*    title="회원 탈퇴"*/}
        {/*    description="정말로 탈퇴하시겠습니까? 탈퇴 시 모든 개인정보와 의료정보가 삭제되며, 이 작업은 되돌릴 수 없습니다. 삭제된 정보는 복구할 수 없으며, 서비스를 다시 이용하시려면 재가입이 필요합니다."*/}
        {/*    confirmText="탈퇴"*/}
        {/*    cancelText="취소"*/}
        {/*    onConfirm={handleSignout}*/}
        {/*    triggerVariant="gray"*/}
        {/*    className="w-24 h-10"*/}
        {/*/>*/}
    <MainTemplate
      navItems={[
        { label: '개인 정보 수정', path: '/user/info' },
        { label: '의료 정보 수정', path: '/user/medi' },
        { label: '비밀번호 수정', path: '/user/updatepassword' },
      ]}
      logoutDirect={logout}
    >
      <UserInfoTemplate
        title="개인 정보 수정"
        content={
          <>
            회원님의 개인정보는 응급 상황 발생 시 본인 확인과 보호자 연락에 사용됩니다.
            <br />
            이름, 이메일, 생년월일을 제외한 연락처 정보를 수정할 수 있습니다.
          </>
        }
        logoSrc={userImg}
        primaryButtonOnClick={handleSave}
        secondaryButtonOnClick={handleSignout}
      >
        <UserInfoForm />
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
          <AlertDescription className="text-base m-2 font-sans whitespace-pre-line">
            {alertConfig.description}
          </AlertDescription>
        </Alert>
      </div>
  )}
</>
  );
};

export default UserInfoPage;

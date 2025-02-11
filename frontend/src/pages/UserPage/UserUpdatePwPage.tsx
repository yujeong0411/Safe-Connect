import MainTemplate from '@components/templates/MainTemplate.tsx';
import UserInfoTemplate from '@features/user/components/UserInfoTemplate.tsx';
import pwImg from '@assets/image/pwImg.png';
import UserPwForm from '@features/user/components/UserPwForm.tsx';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { useAuthStore } from '@/store/user/authStore.tsx';
import { validatePassword, validatePasswordConfirm } from '@utils/validation.ts';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleCheckBig, CircleAlert } from "lucide-react";
import { useState } from 'react';

const UserUpdatePassword = () => {
  const { formData } = useSignupStore();
  const { updatePassword, logout } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    description: '',
    type: 'default' as 'default' | 'destructive',
  });

  const handleShowAlert = (config: typeof alertConfig) => {
    setAlertConfig(config);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  // 비밀번호 변경 요청 처리
  const handlePasswordUpdate = async () => {
    try {
      if (!validatePassword(formData.userPassword)) {
        handleShowAlert({
          title: '비밀번호 형식 오류',
          description: '비밀번호는 숫자, 문자, 특수문자를 포함하여 8자리 이상이어야 합니다.',
          type: 'destructive',
        });
        return;
      }
      if (!validatePasswordConfirm(formData.userPassword, formData.passwordConfirm)) {
        handleShowAlert({
          title: '비밀번호 불일치',
          description: '비밀번호가 일치하지 않습니다.',
          type: 'destructive',
        });
        return;
      }

      await updatePassword({
        userPassword: formData.userPassword,
        newPassword: formData.passwordConfirm,
      });
      handleShowAlert({
        title: '변경 완료',
        description: '비밀번호가 성공적으로 변경되었습니다.',
        type: 'default',
      });
    } catch (error) {
      handleShowAlert({
        title: '변경 실패',
        description: '비밀번호 변경에 실패했습니다.',
        type: 'destructive',
      });
      console.error('비밀번호 변경 실패:', error);
    }
  };

  // 회원탈퇴 핸들러
  const handleSignout = async () => {};

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
        title="비밀번호 수정"
        content="안전한 서비스 이용을 위해 영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 설정해 주세요. "
        logoSrc={pwImg}
        primaryButtonOnClick={handlePasswordUpdate}
        secondaryButtonOnClick={handleSignout}
      >
        <UserPwForm />
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
                <AlertTitle className="text-xl ml-2 font-sans">{alertConfig.title}</AlertTitle>
                <AlertDescription className="text-base m-2 font-sans">
                  {alertConfig.description}
                </AlertDescription>
              </Alert>
            </div>
        )}
      </>
  );
};

export default UserUpdatePassword;

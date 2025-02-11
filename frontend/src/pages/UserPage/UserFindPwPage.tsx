import { useState } from 'react';
import UserFindTemplate from '@features/user/components/UserFindTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/user/authStore.tsx';
// import { useSignupStore } from '@/store/user/signupStore.tsx';
import UserFindPwForm from '@features/user/components/UserFindPwForm.tsx';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleAlert } from "lucide-react";

const UserFindPwPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<'form' | 'success' | 'fail'>('form');
  const { findPassword } = useAuthStore();
  const [userEmail, setUserEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  const handleShowAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  // 비밀번호 찾기 핸들링
  const handleFindPw = async () => {
    try {
      if (!userEmail) {
        handleShowAlert('이메일을 입력해주세요.');
        return;
      }

      const isSuccess = await findPassword(userEmail); // boolean 반환값 사용
      if (isSuccess) {
        setState('success');
      } else {
        handleShowAlert('비밀번호 찾기에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 찾기 실패:', error);
      handleShowAlert('올바른 이메일을 입력하세요.');
    }
  };

  // 상황에 따른 다른 랜더링
  const renderContent = () => {
    switch (state) {
      // 이메칠 찾기 페이지
      case 'form':
        return (
            <>
          <UserFindTemplate
            title="비밀번호 찾기"
            subtitle="회원가입 시 사용한 이메일을 입력하세요. 임시비밀번호가 이메일로 발송됩니다."
            primaryButton={{ text: '비밀번호 찾기', onClick: handleFindPw }}
            secondaryButton={{ text: '이메일 찾기', onClick: () => navigate('/user/findEmail') }}
          >
            <UserFindPwForm onEmailChange={setUserEmail} />
          </UserFindTemplate>

      {showAlert && (
          <div className="fixed left-1/2 top-96 -translate-x-1/2 z-[9999]">
            <Alert
                variant="destructive"
                className="w-[400px] shadow-lg bg-white [&>svg]:text-red-500 text-red-500"
            >
              <CircleAlert className="h-6 w-6" />
              <AlertTitle className="text-xl ml-2 font-sans">비밀번호 찾기 실패</AlertTitle>
              <AlertDescription className="text-base m-2 font-sans">
                {alertMessage}
              </AlertDescription>
            </Alert>
          </div>
      )}
      </>
        );

      // 이메일 찾기 성공 페이지
      case 'success':
        return (
          <UserFindTemplate
            title="임시 비밀번호가 이메일로 발송되었습니다."
            subtitle="입력한 이메일에서 확인하세요."
            primaryButton={{
              text: '이메일 찾기',
              onClick: () => navigate('/user/findemail'),
            }}
          />
        );
    }
  };

  return renderContent();
};

export default UserFindPwPage;

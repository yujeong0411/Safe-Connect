import SignupInfoForm from '@/features/auth/components/SignupInfoForm.tsx';
import SignupTemplate from '@features/auth/components/SignupTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import { validateSignupForm } from '@features/auth/servies/signupService.ts';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleAlert } from "lucide-react";
import SignupMediDialog from "@features/auth/components/SignupMediDialog.tsx";
import { handleSignUp } from '@features/auth/servies/apiService.ts';
import { useAuthStore } from '@/store/user/authStore.tsx';

const UserSignupPage2 = () => {
  const navigate = useNavigate();
  const { formData, resetFormData } = useSignupStore();
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showMedicalDialog, setShowMedicalDialog] = useState(false);

  const handleShowAlert = (errors: string[]) => {
    setErrorMessages(errors);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleNext = () => {
    const validationResults = validateSignupForm(formData);
    if (!Object.values(validationResults).every((result) => result)) {
      const errors = [];

      if (!validationResults.userEmail) {
        if (!formData.userEmail) {
          errors.push('이메일을 입력해주세요');
        } else if (!formData.isEmailVerified) {
          errors.push('이메일 중복확인을 해주세요');
        } else {
          errors.push('올바른 이메일 형식이 아닙니다');
        }
      }

      if (!validationResults.userName) {
        errors.push('이름을 입력해주세요');
      }

      if (!validationResults.userPassword) {
        errors.push('비밀번호는 숫자, 문자, 특수문자를 포함하여 8자리 이상이어야 합니다');
      }

      if (!validationResults.passwordConfirm) {
        errors.push('비밀번호가 일치하지 않습니다');
      }

      if (!validationResults.userPhone) {
        if (!formData.userPhone) {
          errors.push('전화번호를 입력해주세요');
        } else if (!formData.isPhoneVerified) {
          errors.push('전화번호 인증을 완료해주세요');
        } else {
          errors.push('올바른 전화번호 형식이 아닙니다');
        }
      }

      if (!validationResults.residentNumber) {
        errors.push('주민등록번호 앞 7자리를 입력해주세요');
      }

      handleShowAlert(errors);
      return;
    }
    // 유효성 검사 통과 시 의료정보 입력 다이얼로그 표시
    setShowMedicalDialog(true);

  };

  const handleMediConfirm = async () => {
    setShowMedicalDialog(false);
    await handleSignupProcess(true)  // await 추가 -> 상태 업데이트를 기다려야함.
  }

  const handleMediCancel = async () => {
    setShowMedicalDialog(false);
    await handleSignupProcess(false)
  }

  const handleSignupProcess = async (wantMediInfo:boolean) => {
    try {
      // 회원가입 처리 후 토큰 받기
      await handleSignUp(
        formData
        , resetFormData
      )


      await useAuthStore.getState().login({
        userEmail: formData.userEmail,
        userPassword: formData.userPassword
      });
      // 의료정보 입력을 원한다면 다음 페이지 이동
      if (wantMediInfo) {
        navigate('/user/signup/medi', {
          state: {
            fromSignup: true,
            wantMediInfo: true,
            skipRedirect: true  // 리다이렉트 방지 플래그 추가
          }
        });
      }

    } catch (error) {
      console.error('회원가입 실패', error);
      handleShowAlert(['회원가입 처리 중 오류가 발생했습니다.'])
    }
  }

  return (
      <>
    <SignupTemplate currentStep={2} buttonText="다음" onButtonClick={handleNext}>
      <SignupInfoForm />
    </SignupTemplate>

        {showAlert && (
            <div className="fixed left-2/3 top-[300px] -translate-x-1/2 z-[9999]">
              <Alert
                  variant="destructive"
                  className="w-[400px] shadow-lg bg-white [&>svg]:text-red-500 text-red-500"
              >
                <CircleAlert className="h-6 w-6" />
                <AlertTitle className="text-xl ml-2 font-sans">입력 오류</AlertTitle>
                <AlertDescription className="text-base m-2 whitespace-pre-line font-sans">
                  {errorMessages.join('\n')}
                </AlertDescription>
              </Alert>
            </div>
        )}

        <SignupMediDialog
            open={showMedicalDialog}
            onOpenChange={setShowMedicalDialog}
            onConfirm={handleMediConfirm}
            onCancel={handleMediCancel}
        />
      </>
  );
};

export default UserSignupPage2;

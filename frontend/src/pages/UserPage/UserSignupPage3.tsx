import { useSignupStore } from '@/store/user/signupStore';
import SignupMediForm from '@/features/auth/components/SignupMediForm.tsx';
import SignupTemplate from '@features/auth/components/SignupTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleAlert, CircleCheckBig } from "lucide-react";
import { useAuthStore } from '@/store/user/authStore.tsx';

const UserSignupPage3 = () => {
  const navigate = useNavigate();
  const { formData} = useSignupStore();
  const { updateMediInfo } = useAuthStore();
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
    }, 1000);
  };

  const handleNext = async () => {
    try {
      const mediIds = [...(formData.diseaseId || []), ...(formData.medicationId || [])];
      await updateMediInfo({ mediIds });

      handleShowAlert({
        title: "저장 완료",
        description: "의료정보가 성공적으로 저장되었습니다.",
        type: "default"
      });

      setTimeout(() => {
        navigate('/user/main');  // 홈페이지로 이동
      }, 1500);
    } catch (error) {
      console.error('의료정보 저장 실패', error);
      handleShowAlert({
        title: "저장 실패",
        description: "의료정보 저장에 실패했습니다. 다시 시도해주세요.",
        type: "destructive"
      });
    }
  };

  return (
      <>
    <SignupTemplate
      currentStep={3}
      buttonText="저장"
      onButtonClick={handleNext}
      isButtonFixed={true}
    >
      <h1 className="text-3xl font-bold text-left w-full mb-10">의료 정보 입력</h1>
      <SignupMediForm />
    </SignupTemplate>

  {showAlert && (
      <div className="fixed left-2/3 top-[300px] -translate-x-1/2 z-[9999]">
        <Alert
            variant={alertConfig.type}
            className="w-[400px] shadow-lg bg-white"
        >
          {alertConfig.type === 'default' ? (
              <CircleCheckBig className="h-6 w-6" />
          ) : (
              <CircleAlert className="h-6 w-6" />
          )}
          <AlertTitle className="text-xl ml-2 font-sans">{alertConfig.title}</AlertTitle>
          <AlertDescription className="text-base m-2 whitespace-pre-line font-sans">
            {alertConfig.description}
          </AlertDescription>
        </Alert>
      </div>
  )}
</>
);
};

export default UserSignupPage3;

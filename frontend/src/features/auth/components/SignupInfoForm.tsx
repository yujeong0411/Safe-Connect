import React, {useState} from 'react';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import Input from '@components/atoms/Input/Input';
import SearchBar from '@components/molecules/SearchBar/SearchBar.tsx';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { ResidentNumberInput } from '@features/auth/components/ResidentNumberInput.tsx';
import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { CircleAlert, CircleCheckBig } from "lucide-react";
import {
  checkEmailDuplication,
  sendPhoneVerification,
  authCode,
} from '@features/auth/servies/apiService.ts';
import { validateResidentNumber } from '@utils/validation.ts';

const SignupInfoForm = () => {
  const { formData, setFormData, validateFields } = useSignupStore();
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
    }, 3000);
  };


  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;  // 재할당 가능하게 let

    // 이메일과 비밀번호는 공백제거
    if (name === 'userEmail' || name === 'userPassword' || name === 'passwordConfirm') {
      value = value.replace(/\s/g, '');
    }

    const processedValue =
      name === 'userPhone' || name === 'userProtectorPhone' ? formatPhoneNumber(value) : value;

    setFormData({ [name]: processedValue });
  };

  const handleEmailVerify = async () => {
    const result = await checkEmailDuplication(formData.userEmail);
    if (result.isSuccess) {
      setFormData({ isEmailVerified: true });
    handleShowAlert({
      title: '이메일 확인',
      description: result.message,
      type: 'default'
    });
    } else {
      handleShowAlert({
        title: '이메일 중복',
        description: result.message,
        type: 'destructive'
      });
    }
  };

  const handlePhoneSendVerification = async () => {
    try {
      const isSuccess = await sendPhoneVerification(formData.userPhone);
      if (isSuccess) {
        handleShowAlert({
          title: '인증번호 발송',
          description: '인증번호가 발송되었습니다.',
          type: 'default'
        });
      }
    } catch (error) {
      handleShowAlert({
        title: '발송 실패',
        description: '인증번호 발송에 실패했습니다.',
        type: 'destructive'
      });
    }
  };

  const handlePhoneVerify = async () => {
    try {
      const isSuccess = await authCode(formData.userPhone, formData.authCode);
      if (isSuccess) {
        setFormData({ isPhoneVerified: true });
        handleShowAlert({
          title: '인증 완료',
          description: '인증이 완료되었습니다.',
          type: 'default'
        });
      }
    } catch (error) {
      handleShowAlert({
        title: '인증 실패',
        description: '인증번호를 다시 확인해주세요.',
        type: 'destructive'
      });
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-left w-full mb-10 font-sans">기본 정보 입력</h1>
      <div className="flex flex-row gap-10">
        {/*왼쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*이메일 + 중복확인*/}
            <SearchBar
              label="이메일"
              value={formData.userEmail}
              onChange={handleChange('userEmail')}
              onButtonClick={handleEmailVerify}
              buttonText="중복확인"
              error={validateFields('userEmail', formData.userEmail)}
              isRequired
            />
            <Input
              label="이름"
              value={formData.userName}
              onChange={handleChange('userName')}
              isRequired
            />
            <Input
              label="비밀번호"
              type="password"
              value={formData.userPassword}
              onChange={handleChange('userPassword')}
              error={validateFields('userPassword', formData.userPassword)}
              isRequired
            />
            <Input
              label="비밀번호 확인"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange('passwordConfirm')}
              error={validateFields('passwordConfirm', formData.passwordConfirm)}
              isRequired
            />
          </div>
        </div>

        {/*오른쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*전화번호*/}
            <SearchBar
              label="전화번호"
              value={formData.userPhone}
              onChange={handleChange('userPhone')}
              onButtonClick={handlePhoneSendVerification}
              placeholder="전화번호를 입력하세요."
              buttonText="전송"
              error={validateFields('userPhone', formData.userPhone)}
              isRequired
            />
            <SearchBar
              label="전화번호 확인"
              value={formData.authCode}
              onChange={handleChange('authCode')}
              onButtonClick={handlePhoneVerify}
              placeholder="문자로 받은 인증번호를 입력하세요."
              buttonText="인증"
              isRequired
            />
            <ResidentNumberInput
              value={formData.userBirthday + formData.userGender}
              onChange={(birthdayAndGender) => {
                setFormData({
                  userBirthday: birthdayAndGender.userBirthday,
                  userGender: birthdayAndGender.userGender,
                });
              }}
              error={validateResidentNumber(formData.userBirthday + formData.userGender)}
            />
            <Input
              label="보호자 연락처"
              value={formData.userProtectorPhone}
              onChange={handleChange('userProtectorPhone')}
              error={validateFields('userProtectorPhone', formData.userProtectorPhone)}
            />
          </div>
        </div>
      </div>

      {showAlert && (
          <div className="fixed left-2/3 top-[300px] -translate-x-1/2 z-[9999]">
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
              <AlertTitle className="text-lg ml-2">{alertConfig.title}</AlertTitle>
              <AlertDescription className="text-sm m-2">
                {alertConfig.description}
              </AlertDescription>
            </Alert>
          </div>
      )}
    </div>
  );
};

export default SignupInfoForm;

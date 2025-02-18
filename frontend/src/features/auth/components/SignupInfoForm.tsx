import React, {useState, useEffect} from 'react';
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
  const [isPhoneSent, setIsPhoneSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [authInitiated, setAuthInitiated] = useState<boolean>(false);  // 인증 시작 여부를 추적하는 상태 추가
  const [verifiedEmail, setVerifiedEmail] = useState<string | "">("");
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string | "">("");
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


  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;  // 재할당 가능하게 let

    // 이메일과 비밀번호는 공백제거
    if (name === 'userEmail' || name === 'userPassword' || name === 'passwordConfirm') {
      value = value.replace(/\s/g, '');
    }

    const processedValue =
      name === 'userPhone' || name === 'userProtectorPhone' ? formatPhoneNumber(value) : value;

    if (name === 'userEmail' && verifiedEmail && value !== verifiedEmail) {
      setFormData({
        [name]: processedValue,
        isEmailVerified: false // 이메일 인증 상태 초기화
      });
      handleShowAlert({
        title: '이메일 변경',
        description: '이메일이 변경되었습니다. 다시 중복확인을 해주세요.',
        type: 'destructive'
      });
    }
    // 전화번호 변경 검사
    else if (name === 'userPhone' && formData.isPhoneVerified && value !== verifiedPhoneNumber) {
      setFormData({
        [name]: processedValue,
        isPhoneVerified: false,
        authCode: ''  // 인증번호 초기화
      });
      setIsPhoneSent(false);  // 인증번호 전송 상태 초기화
      setAuthInitiated(false);  // 인증 시작 상태 초기화
      if (timer) {
        clearInterval(timer);  // 타이머 정지
        setTimeLeft(null);
      }
      handleShowAlert({
        title: '전화번호 변경',
        description: '전화번호가 변경되었습니다. 다시 인증을 받아주세요.',
        type: 'destructive'
      });
    } else {
      setFormData({ [name]: processedValue });
    }
  };

  const handleEmailVerify = async () => {
    const result = await checkEmailDuplication(formData.userEmail);
    if (result.isSuccess) {
      setFormData({ isEmailVerified: true });
      setVerifiedEmail(formData.userEmail);
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


  // 인증번호 타이머
  const startTimer = () => {
    if (timer) clearInterval(timer)  // 이전 타이머가 있다면 제거
    setTimeLeft(179)  // 3분
    const newTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev  <= 0) {
          clearInterval(newTimer);
          return null
        }
        return prev - 1;
      })
    }, 1000)
    setTimer(newTimer)
  }

  // 컴파운드 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [timer])

  // 타이머 시간 포맷팅
  const formatTime = (seconds:number | null) => {
    if (seconds === null) return '';
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60
    return  `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const handlePhoneSendVerification = async () => {
    try {
      const isSuccess = await sendPhoneVerification(formData.userPhone);
      if (isSuccess) {
        setIsPhoneSent(true);  // 전송 성공 시 상태 변경
        setAuthInitiated(true);  // 인증번호 발송 중
        startTimer()  // 타이머 시작
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
        setVerifiedPhoneNumber(formData.userPhone);
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
    <div className="w-full px-4 md:px-20">
      <h1 className="text-2xl md:text-3xl font-bold text-left w-full mb-6 md:mb-10 font-sans">기본 정보 입력</h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/*왼쪽*/}
        <div className="w-full md:flex-1">
          <div className="flex flex-col gap-4 md:gap-8">
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
        <div className="w-full md:flex-1">
          <div className="flex flex-col gap-4 md:gap-8">
            {/*전화번호*/}
            <SearchBar
              label="전화번호"
              value={formData.userPhone}
              onChange={handleChange('userPhone')}
              onButtonClick={handlePhoneSendVerification}
              placeholder="전화번호를 입력하세요."
              buttonText={isPhoneSent ? "인증번호 재전송" : "인증번호 전송"}
              error={validateFields('userPhone', formData.userPhone)}
              isRequired
            />
            <SearchBar
              label="인증번호 확인"
              value={formData.authCode}
              onChange={handleChange('authCode')}
              onButtonClick={handlePhoneVerify}
              placeholder={
                !authInitiated
                    ? "인증번호를 입력해주세요."
                    : timeLeft
                        ? `남은 시간 ${formatTime(timeLeft)}`
                        : "인증 시간이 만료되었습니다. 재전송해주세요."
              }
              buttonText="인증하기"
              isDisabled={timeLeft === null}
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
          <div className="fixed left-1/2 md:left-2/3 top-[300px] -translate-x-1/2 z-[9999]">
            <Alert
                variant={alertConfig.type}
            >
              {alertConfig.type === 'default' ? (
                  <CircleCheckBig className="h-5 md:h-6 w-5 md:w-6" />
              ) : (
                  <CircleAlert className="h-5 md:h-6 w-5 md:w-6" />
              )}
              <AlertTitle>{alertConfig.title}</AlertTitle>
              <AlertDescription>
                {alertConfig.description}
              </AlertDescription>
            </Alert>
          </div>
      )}
    </div>
  );
};

export default SignupInfoForm;

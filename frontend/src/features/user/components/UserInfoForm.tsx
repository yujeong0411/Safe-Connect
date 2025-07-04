import { formatPhoneNumber } from '@features/auth/servies/signupService.ts';
import { validatePhoneNumber } from '@utils/validation';
import { useSignupStore } from '@/store/user/signupStore.tsx';
import Input from '@components/atoms/Input/Input.tsx';
import { SignupStore } from '@/store/user/signupStore.tsx';
import React, {useEffect, useState} from 'react';
import {authCode, sendPhoneVerification} from "@features/auth/servies/apiService.ts";
import SearchBar from "@components/molecules/SearchBar/SearchBar.tsx";
import {Alert, AlertDescription, AlertTitle} from "@components/ui/alert.tsx";
import {CircleAlert, CircleCheckBig} from "lucide-react";

const UserInfoForm = () => {
  const { formData, setFormData, validateFields } = useSignupStore();
    const [showAlert, setShowAlert] = useState(false);
    const [isPhoneSent, setIsPhoneSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [authInitiated, setAuthInitiated] = useState<boolean>(false);  // 인증 시작 여부를 추적하는 상태 추가
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

  const handleChange =
    (name: keyof SignupStore['formData']) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let { value } = e.target;
      const processedValue =
        name === 'userPhone' || name === 'userProtectorPhone' ? formatPhoneNumber(value) : value;
      setFormData({ [name]: processedValue });

        if (name === 'userPhone' && formData.isPhoneVerified && value !== verifiedPhoneNumber) {
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
      <>
    <div className="w-full flex flex-col max-w-4xl md:flex-row gap-5 md:gap-20 p-4 md:p-0">
      {/*왼쪽*/}
      <div className="w-full md:flex-1">
        <div className="flex flex-col gap-5">
          {/*이메일 (비활성화)*/}
          <Input
            label="이메일"
            value={formData.userEmail}
            onChange={handleChange('userEmail')}
            isRequired
            disabled={true}
          />
          <Input
            label="이름"
            value={formData.userName}
            onChange={handleChange('userName')}
            isRequired
            disabled
          />
            <Input
                label="보호자 연락처"
                value={formData.userProtectorPhone}
                onChange={handleChange('userProtectorPhone')}
                error={
                    formData.userProtectorPhone && !validatePhoneNumber(formData.userProtectorPhone)
                        ? '올바른 전화번호 형식이 아닙니다.'
                        : ''
                }
            />
        </div>
      </div>

      {/*오른쪽*/}
      <div className="w-full md:flex-1">
          <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-5">
                  {/*주민등록번호 (비활성화)*/}
                  <Input
                      label="성별"
                      value={formData.userGender}
                      onChange={handleChange('userGender')}
                      disabled={true}
                      isRequired
                  />
                  <Input
                      label="생년월일"
                      value={formData.userBirthday}
                      onChange={handleChange('userBirthday')}
                      disabled={true}
                      isRequired
                  />
              </div>
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
              </div>
          </div>

    </div>
          {showAlert && (
              <div className="fixed left-1/2 top-[300px] -translate-x-1/2 z-[999]">
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
                    <AlertDescription className="text-base m-2">
                        {alertConfig.description}
                    </AlertDescription>
                </Alert>
            </div>
        )}
    </>
  );
};

export default UserInfoForm;

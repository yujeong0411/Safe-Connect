// 잠깐 복사!!!!

import React, { useState } from 'react';
import Input from '@components/atoms/Input/Input';
import SearchBar from '@components/molecules/SearchBar/SearchBar.tsx';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { ResidentNumberInput } from '@features/auth/components/ResidentNumberInput.tsx';
import axios from 'axios';

const SignupInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    isEmailVerified: false,
    name: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    isPhoneVerified: false,
    verificationCode: '',
    residentNumber: '',
    guardianPhone: '',
  });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  //유효성 검사
  const validateFields = (name: keyof FormData, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : '올바른 이메일 형식이 아닙니다.';
      case 'password':
        if (!value) return '';
        return value.length >= 8 ? '' : '비밀번호는 8자 이상이어야 합니다.';
      case 'passwordConfirm':
        if (!value) return '';
        return value === formData.password ? '' : ' 비밀번호가 일치하지 않습니다.';
      case 'phoneNumber':
        if (!value) return '';
        return /^\d{3}-\d{3,4}-\d{4}$/.test(value) ? '' : '올바른 전화번호 형식이 아닙니다.';
      case 'residentNumber':
        if (!value) return '';
        return /^\d{7}$/.test(value) ? '' : '주민등록번호 앞 7자리를 입력해주세요.';
      default:
        return '';
    }
  };

  // 1. name: 폼 데이터의 특정 키 (예: 'email', 'password')를 받음
  // 2. e: 입력 이벤트 객체
  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const processedValue = name === 'phoneNumber' ? formatPhoneNumber(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // 이메일 중복확인
  const handleEmailVerify = async () => {
    try {
      // API 호출
      const response = await axios.get(`user/valid/email?email=${formData.email}`);

      if (response.data.isSuccess === 'success') {
        setFormData((prev) => ({ ...prev, isEmailVerified: true }));
        alert('사용가능한 이메일입니다.');
      }
    } catch (error) {
      if (error.response?.data.isSuccess === 'false') {
        alert(error.response.data.message);
      }
    }
  };

  // 휴대폰 인증번호 요청
  const handlePhoneSendVerification = async () => {
    try {
      // API 호출
      const response = await axios.post('user/valid/phone', {
        userPhone: formData.phoneNumber.replace(/-/g, ''),
      });
      if (response.data.isSuccess === 'success') {
        alert('인증번호가 발송되었습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('인증번호 발송에 실패했습니다.');
    }
  };

  // 휴대폰 인증번호 확인
  const handlePhoneVerify = async () => {
    try {
      // API 호출
      const response = await axios.post('user/valid/phone/check', {
        userPhone: formData.phoneNumber.replace(/-/g, ''),
        verificationCode: formData.verificationCode,
      });
      if (response.data.isSuccess === 'success') {
        setFormData((prev) => ({ ...prev, isPhoneVerified: true }));
        alert('인증이 완료되었습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-left w-full mb-10">기본 정보 입력</h1>
      <div className="flex flex-row gap-10">
        {/*왼쪽*/}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/*이메일 + 중복확인*/}
            <SearchBar
              label="이메일"
              value={formData.email}
              onChange={handleChange('email')}
              onButtonClick={handleEmailVerify}
              buttonText="중복확인"
              error={validateFields('email', formData.email)}
              isRequired
            />
            <Input label="이름" value={formData.name} onChange={handleChange('name')} isRequired />
            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={validateFields('password', formData.password)}
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
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              onButtonClick={handlePhoneSendVerification}
              placeholder="전화번호를 입력하세요."
              buttonText="전송"
              error={validateFields('phoneNumber', formData.phoneNumber)}
              isRequired
            />
            <SearchBar
              label="전화번호 확인"
              value={formData.verificationCode}
              onChange={handleChange('verificationCode')}
              onButtonClick={handlePhoneVerify}
              placeholder="문자로 받은 인증번호를 입력하세요."
              buttonText="인증"
              isRequired
            />
            <ResidentNumberInput />
            <Input
              label="보호자 연락처"
              value={formData.guardianPhone}
              onChange={handleChange('guardianPhone')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupInfoForm;

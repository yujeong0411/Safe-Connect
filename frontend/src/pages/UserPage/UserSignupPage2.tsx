import React, { useState } from 'react';
import SignupInfoForm from '@/features/auth/components/SignupInfoForm.tsx';
import SignupTemplate from '@components/templates/SignupTemplate.tsx';
import { useNavigate } from 'react-router-dom';
import { FormData } from '@features/auth/types/SignupForm.types.ts';
import { validateSignupForm } from '@features/auth/servies/signupService.ts';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validatePhoneNumber,
  validateResidentNumber,
} from '@utils/validation.ts';

const UserSignupPage2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    userEmail: '',
    isEmailVerified: false,
    userName: '',
    userPassword: '',
    passwordConfirm: '',
    userPhone: '',
    isPhoneVerified: false,
    verificationCode: '',
    userBirthday: '',
    userGender: '',
    userProtectorPhone: '',
  });

  const validateFields = (name: keyof FormData, value: string) => {
    // 빈 값에 대해서는 에러 메시지 반환하지 않음
    if (!value) return '';

    switch (name) {
      case 'userEmail':
        if (!value) return '';
        return validateEmail(value) ? '' : '올바른 이메일 형식이 아닙니다.';
      case 'userPassword':
        if (!value) return '';
        return validatePassword(value)
          ? ''
          : '숫자, 문자, 특수문자를 포함하여 8자리 이상입력하세요.';
      case 'passwordConfirm':
        if (!value) return '';
        return validatePasswordConfirm(formData.userPassword, value)
          ? ''
          : ' 비밀번호가 일치하지 않습니다.';
      case 'userPhone':
        if (!value) return '';
        return validatePhoneNumber(value) ? '' : '올바른 전화번호 형식이 아닙니다.';
      case 'userProtectorPhone':
        if (!value) return '';
        return validateResidentNumber(value) ? '' : '올바른 전화번호 형식이 아닙니다.';

      default:
        return '';
    }
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

      alert(errors.join('\n'));
      return;
    }

    navigate('/user/signup/medi', { state: { formData } });
  };
  return (
    <SignupTemplate currentStep={2} buttonText="다음" onButtonClick={handleNext}>
      <SignupInfoForm
        formData={formData}
        setFormData={setFormData}
        validateFields={validateFields}
      />
    </SignupTemplate>
  );
};

export default UserSignupPage2;

import { FormData } from '@features/auth/types/SignupForm.types';
import * as validate from '@/utils/validation';

// 회원가입 폼의 각 필드에 대한 유효성 검사 수행
export const validateSignupForm = (formData: FormData) => {
  return {
    // 이메일: 이메일 형식 검증 및 중복 확인 여부
    userEmail: validate.validateEmail(formData.userEmail) && formData.isEmailVerified,

    // 이름: 공백 제거 후 빈 문자열이 아닌지 확인
    userName: formData.userName.trim() !== '',

    // 비밀번호: 최소 길이 만족
    userPassword: validate.validatePassword(formData.userPassword),

    // 비밀번호 확인: 원래 비밀번호와 일치 여부
    passwordConfirm: validate.validatePasswordConfirm(
      formData.userPassword,
      formData.passwordConfirm
    ),

    // 전화번호: 형식 검증 및 인증 여부

    userPhone: validate.validatePhoneNumber(formData.userPhone) && formData.isPhoneVerified,

    // 주민등록번호: 7자리 형식 검증
    residentNumber: formData.userBirthday && formData.userGender, // 생년월일과 성별 모두 있는지 확인
  };
};

// 전화번호 하이픈 자동 포맷팅
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }
};

import { axiosInstance } from '@utils/axios.ts';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 이메일 중복 확인 API 호출
export const checkEmailDuplication = async (email: string) => {
  try {
    console.log('Sending email verification request:', email);
    const response = await axiosInstance.get(`/user/valid/email`, {
      params: { userEmail: email },
    });
    console.log('Email verification response:', response.data);
    if (response.data.isSuccess === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Email verification error', error);
    // 에러 응답의 isSuccess 확인
    throw error;
  }
};

// 휴대폰 인증번호 요청 API 호출
export const sendPhoneVerification = async (phoneNumber: string) => {
  try {
    console.log('Sending phone verification for:', phoneNumber);
    const response = await axiosInstance.post('/user/valid/phone', {
      userPhone: phoneNumber.replace(/-/g, ''),
    });
    console.log('Phone verification response:', response.data);
    if (response.data.isSuccess === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Phone verification send error', error);
    throw error;
  }
};

// 휴대폰 인증번호 확인 API 호출
export const authCode = async (phoneNumber: string, verificationCode: string) => {
  try {
    console.log('Verifying phone code for:', phoneNumber, 'Code:', verificationCode);
    const response = await axiosInstance.post('/user/valid/phone/check', {
      userPhone: phoneNumber.replace(/-/g, ''),
      authCode: verificationCode,
    });
    console.log('Phone code verification response:', response.data);
    if (response.data.isSuccess === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Phone verification check error', error);
    throw error;
  }
};

export const handleSignUp = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/user/signup', formData);
    if (response.data.isSuccess === true) {
      // 성공 시 메인페이지 이동
      navigate('/user/main');
    }
  } catch (error) {
    // 실패시
    console.error('Signup error', error);
    alert('회원가입 실패');
  }
};

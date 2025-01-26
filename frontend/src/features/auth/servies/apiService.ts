import { axiosInstance } from '@utils/axios.ts';

// 이메일 중복 확인 API 호출
export const checkEmailDuplication = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/user/valid/email`);
    // 'success' 문자열 비교 유지
    return response.data.isSuccess === 'success';
  } catch (error) {
    console.error('Email verification error', error);
    // 에러 응답의 isSuccess 확인

    throw error;
  }
};

// 휴대폰 인증번호 요청 API 호출
export const sendPhoneVerification = async (phoneNumber: string) => {
  try {
    const response = await axiosInstance.post('/user/valid/phone', {
      userPhone: phoneNumber.replace(/-/g, ''),
    });
    // 'success' 문자열 비교 유지
    return response.data.isSuccess === 'success';
  } catch (error) {
    console.error('Phone verification send error', error);
    throw error;
  }
};

// 휴대폰 인증번호 확인 API 호출
export const verifyPhoneCode = async (phoneNumber: string, verificationCode: string) => {
  try {
    const response = await axiosInstance.post('/user/valid/phone/check', {
      userPhone: phoneNumber.replace(/-/g, ''),
      verificationCode,
    });
    // 'success' 문자열 비교 유지
    return response.data.isSuccess === 'success';
  } catch (error) {
    console.error('Phone verification check error', error);
    throw error;
  }
};

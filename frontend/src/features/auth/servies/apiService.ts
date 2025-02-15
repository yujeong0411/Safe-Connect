import { AxiosError } from 'axios';
import { axiosInstance } from '@utils/axios.ts';
import { FormData } from '@features/auth/types/SignupForm.types';
import { MedicalCategory, MedicalItem } from '@/types/common/medical.types.ts';

// 이메일 중복 확인 API 호출
export const checkEmailDuplication = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/user/valid/email`, {
      params: { userEmail: email }, // URL 쿼리 파라미터로 전송
    });
    if (response.data.isSuccess) {
      return {
        isSuccess: true,
        message: '사용 가능한 이메일입니다.',
      };
    }

    return {
      isSuccess: false,
      message: response.data.message || '이메일 중복 확인에 실패했습니다.',
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        return {
          isSuccess: false,
          message: error.response.data.message,
        };
      }
    }
    return {
      isSuccess: false,
      message: '서버 오류가 발생했습니다.',
    };
  }
};

// 휴대폰 인증번호 요청 API 호출
export const sendPhoneVerification = async (phoneNumber: string) => {
  try {
    console.log('Sending phone verification for:', phoneNumber);
    const response = await axiosInstance.post('/user/valid/phone', {
      userPhone: phoneNumber.replace(/-/g, ''), // json 형식 전송
    });
    console.log('Phone verification response:', response.data);
    return response.data.isSuccess === true;
  } catch (error: unknown) {
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
    return response.data.isSuccess === true;
  } catch (error) {
    console.error('Phone verification check error', error);
    throw error;
  }
};

// 회원가입 로직
export const handleSignUp = async (
  formData: FormData,
  resetFormData: () => void,
  // navigate?: (path: string) => void  // 네비게이션 함수 옵셔널
): Promise<void> => {
  try {
    const response = await axiosInstance.post('/user/signup', formData);

    if (response.data.isSuccess === true) {
      resetFormData(); // store 초기화 (안하면 입력창에 자동입력됨.)
    } else {
      console.error('Signup failed:', response.data.message); // 실패 메시지 기록
      alert(response.data.message);
    }
  } catch (error) {
    // 실패시
    console.error('Signup error', error);
    alert('회원가입 실패');
  }
};

// 회원탈퇴 로직
export const signOut = async (navigate: (path: string) => void) => {
  try {
    const confirmed = window.confirm('정말 회원 탈퇴하시겠습니까?');
    if (confirmed) {
      const response = await axiosInstance.delete('/user/signout');
      if (response.data.isSuccess) {
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/user/login');
        return true;
      }
    }
    return false;
  } catch (error) {
    alert('회원 탈퇴에 실패하였습니다.');
    throw error;
  }
};

// 이메일 찾기 (전화번호는 하이픈 필수...., 없으면 불일치 뜸)
export const findEmail = async (userName: string, userPhone: string) => {
  try {
    const response = await axiosInstance.get('/user/find/email', {
      params: { userName, userPhone },
    });

    // 전체 응답 데이터 로깅
    console.log('전체 응답 데이터:', response.data);

    if (response.data.isSuccess === true) {
      return {
        isSuccess: true,
        userEmail: response.data.data.userEmail,
        message: '이메일이 조회되었습니다.',
      };
    }
    return {
      isSuccess: false,
      message: response.data.message || '이메일을 찾을 수 없습니다.',
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('findEmail failed:', {
      errorMessage: axiosError.message,
      errorResponse: axiosError.response?.data,
      errorStatus: axiosError.response?.status,
    });
    return {
      isSuccess: false,
      message: '이메일 조회 중 오류가 발생했습니다.',
    };
  }
};

// 비밀번호 찾기
/*export const findPassword = async (userEmail: string) => {
  try {
    const response = await axiosInstance.put('/user/find/password', { userEmail: userEmail });
    console.log('find Password response', response.data);
    if (response.data.isSuccess === true) {
      return {
        isSuccess: true,
        message: response.data.message,
      };
    }
    return {
      isSuccess: false,
      message: response.data.message,
    };
  } catch (error) {
    console.error('findPassword failed:', error);
    throw error; // 에러를 throw하여 컴포넌트에서 처리
  }
};*/

// 전체 의료 데이터 조회(크롤링)
export const fetchMedicalData = async () => {
  try {
    const response = await axiosInstance.get('/user/medi/list');
    console.log('API 응답:', response.data); // 전체 응답 데이터 확인

    const medicationOptions =
      response.data.data
        .find((category: MedicalCategory) => category.categoryName === '복용약물')
        ?.mediList.map((item: MedicalItem) => ({
          value: Number(item.mediId), // mediId를 명시적으로 숫자로 변환
          label: item.mediName,
        })) || [];

    const diseaseOptions =
      response.data.data
        .find((category: MedicalCategory) => category.categoryName === '기저질환')
        ?.mediList.map((item: MedicalItem) => ({
          value: Number(item.mediId), // mediId를 명시적으로 숫자로 변환
          label: item.mediName,
        })) || [];

    console.log('변환된 옵션:', { medicationOptions, diseaseOptions });
    return { medicationOptions, diseaseOptions };
  } catch (error) {
    console.error('fetchMedicalData failed:', error);
    throw error;
  }
};

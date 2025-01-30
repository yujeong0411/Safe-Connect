import { create } from 'zustand';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validatePhoneNumber,
} from '@/utils/validation';

export interface SignupStore {
  formData: {
    userEmail: string;
    isEmailVerified: boolean;
    userName: string;
    userPassword: string;
    passwordConfirm: string;
    userPhone: string;
    isPhoneVerified: boolean;
    authCode: string;
    userBirthday: string;
    userGender: string;
    userProtectorPhone: string;
    diseaseId?: number[]; // string -> number로 변경 (mediId가 숫자임)
    medicationId?: number[]; // string -> number로 변경
  };
  diseaseOptions: {
    // medicalHistoryOptions -> diseaseOptions
    value: number;
    label: string;
  }[];
  medicationOptions: {
    value: number;
    label: string;
  }[];

  setFormData: (data: Partial<SignupStore['formData']>) => void;
  resetFormData: () => void;
  setDiseaseOptions: (options: { value: number; label: string }[]) => void;
  setMedicationOptions: (options: { value: number; label: string }[]) => void;
  validateFields: (name: keyof FormData, value: string) => string;
}
type FormData = SignupStore['formData'];

export const useSignupStore = create<SignupStore>((set, get) => ({
  formData: {
    userEmail: '',
    isEmailVerified: false,
    userName: '',
    userPassword: '',
    passwordConfirm: '',
    userPhone: '',
    isPhoneVerified: false,
    authCode: '',
    userBirthday: '',
    userGender: '',
    userProtectorPhone: '',
    diseaseId: [],
    medicationId: [],
  },
  diseaseOptions: [],
  medicationOptions: [],

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetFormData: () =>
    set({
      formData: {
        userEmail: '',
        isEmailVerified: false,
        userName: '',
        userPassword: '',
        passwordConfirm: '',
        userPhone: '',
        isPhoneVerified: false,
        authCode: '',
        userBirthday: '',
        userGender: '',
        userProtectorPhone: '',
        diseaseId: [], // 변경
        medicationId: [], // 변경
      },
    }),

  validateFields: (name: keyof FormData, value: string) => {
    // 입력값이 비어 있는 경우 에러를 반환하지 않음
    if (!value) return '';

    const { formData } = get();

    switch (name) {
      case 'userEmail':
        return validateEmail(value) ? '' : '올바른 이메일 형식이 아닙니다.';
      case 'userPassword':
        return validatePassword(value)
          ? ''
          : '숫자, 문자, 특수문자를 포함하여 8자리 이상 입력하세요.';
      case 'passwordConfirm':
        return validatePasswordConfirm(formData.userPassword, value)
          ? ''
          : '비밀번호가 일치하지 않습니다.';
      case 'userPhone':
        return validatePhoneNumber(value) ? '' : '올바른 전화번호 형식이 아닙니다.';
      case 'userProtectorPhone':
        return validatePhoneNumber(value) ? '' : '올바른 전화번호 형식이 아닙니다.';
      default:
        return '';
    }
  },
  setDiseaseOptions: (options) => set({ diseaseOptions: options }), // 변경
  setMedicationOptions: (options) => set({ medicationOptions: options }), // 변경
}));

import { create } from 'zustand';

interface SignupStore {
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
    medicalHistory?: string;
    medication?: string;
  };
  medicalHistoryOptions: { value: string; label: string }[];
  medicationOptions: { value: string; label: string }[];
  setFormData: (data: Partial<SignupStore['formData']>) => void;
  resetFormData: () => void;
  setMedicalHistoryOptions: (options: { value: string; label: string }[]) => void;
  setMedicationOptions: (options: { value: string; label: string }[]) => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
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
    medicalHistory: '',
    medication: '',
  },
  medicalHistoryOptions: [],
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
        medicalHistory: '',
        medication: '',
      },
    }),
  setMedicalHistoryOptions: (options) => set({ medicalHistoryOptions: options }),
  setMedicationOptions: (options) => set({ medicationOptions: options }),
}));

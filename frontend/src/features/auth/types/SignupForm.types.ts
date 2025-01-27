export interface SignupPerFormProps {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
}

export interface FormData {
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
}

export interface SignupInfoFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  validateFields: (name: keyof FormData, value: string) => string;
}

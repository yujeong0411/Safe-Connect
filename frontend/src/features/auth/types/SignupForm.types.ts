export interface SignupPerFormProps {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
}

export interface FormData {
  email: string;
  isEmailVerified: boolean;
  name: string;
  password: string;
  passwordConfirm: string;
  phoneNumber: string;
  verificationCode: string;
  isPhoneVerified: boolean;
  residentNumber: string;
  guardianPhone?: string;
}

export interface SignupInfoFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  validateFields: (name: keyof FormData, value: string) => string;
}

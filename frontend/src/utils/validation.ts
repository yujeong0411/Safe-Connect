// src/utils/validation.ts
export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string): boolean => password.length >= 8;

export const validatePasswordConfirm = (password: string, confirmPassword: string): boolean =>
  password === confirmPassword;

export const validatePhoneNumber = (phoneNumber: string): boolean =>
  /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);

export const validateResidentNumber = (residentNumber: string): boolean =>
  /^\d{7}$/.test(residentNumber);

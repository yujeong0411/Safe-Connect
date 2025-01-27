export const validateEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|kr)$/.test(email);

// 최소 8자 이상, 하나 이상의 영문(대문자/소문자), 숫자, 특수문자를 포함해야 함
export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export const validatePasswordConfirm = (password: string, confirmPassword: string): boolean =>
  password === confirmPassword;

export const validatePhoneNumber = (phoneNumber: string): boolean =>
  /^\d{3}-\d{4}-\d{4}$/.test(phoneNumber);

export const validateResidentNumber = (residentNumber: string): boolean => {
  // 숫자 7자리 검사
  const regex = /^\d{6}[1-4]$/;

  // 전체 길이와 기본 형식 검사
  if (residentNumber.length !== 7 || !regex.test(residentNumber)) return false;

  return true;
};

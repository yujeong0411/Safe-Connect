export interface User {
  id?: number;
  userEmail: string;
  userName: string;
  userBirthday: string;
  userGender: 'M' | 'F';
  userPhone: string;
  userProtectorPhone: string;
}

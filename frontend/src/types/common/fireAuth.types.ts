export interface FireLoginRequest {
  fireStaffLoginId: string;
  fireStaffPassword: string;
}

export interface FireAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  // setUserName : (userName:string) =>void;
  login: (data: FireLoginRequest) => Promise<void>; // 타입 변경
  logout: () => void;
  userName? : string | null;
}

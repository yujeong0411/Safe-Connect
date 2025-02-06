export interface FireLoginRequest {
  fireStaffLoginId: string;
  fireStaffPassword: string;
}

export interface FireAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: FireLoginRequest) => Promise<void>; // 타입 변경
  logout: () => void;
}

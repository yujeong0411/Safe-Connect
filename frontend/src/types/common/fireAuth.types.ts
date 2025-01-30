export interface FireLoginRequest {
  fireStaffLogInId: string;
  fireStaffPassword: string;
}

export interface FireAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: Record<string, string>) => Promise<void>; // 타입 변경
  logout: () => void;
}

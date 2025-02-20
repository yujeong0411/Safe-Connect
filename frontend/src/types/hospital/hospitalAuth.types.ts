export interface HospitalLoginRequest {
  hospitalLoginId: string;
  hospitalPassword: string;
}

export interface HospitalAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: HospitalLoginRequest) => Promise<void>; // 타입 변경
  logout: () => void;
  userName? : string | null;
}


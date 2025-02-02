// 공통 필드는 제외하고 로그인 방식에 따라 타입 분리
export interface EmailLoginRequest {
  userEmail: string;
  userPassword: string;
}

// 로그인 응답으로 받는 데이터 타입
export interface AuthResponse {
  token: string;
  isSuccess: boolean;
  message?: string;
}

// 인증 상태 관련 타입(Zustand 용)  -> 안쓰면 삭제
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  //setAuthenticated: (auth: boolean) => void;
  //checkAuth: () => void; // 추가된 함수
}

// 상태와 액션을 포함한 스토어 타입
export interface AuthStore {
  userEmail: string;
  token: string | null;
  isAuthenticated: boolean;
  //setAuthenticated: (auth: boolean) => void;
  //checkAuth: () => void; // 추가된 함수
  login: (data: EmailLoginRequest) => Promise<void>;
  logout: () => Promise<any>;
  fetchUserInfo: () => Promise<any>;
  updateUserInfo: (updateData: any) => Promise<any>;
  fetchMediInfo: () => Promise<any>;
  saveMediInfo: (updateData: any) => Promise<any>;
  updateMediInfo: (updateData: any) => Promise<any>;
  updatePassword: (updateData: any) => Promise<any>;
  findEmail: (userName: string, userPhone: string) => Promise<string>;
  findPassword: (userEmail: string) => Promise<string>;
}

// 공통 필드는 제외하고 로그인 방식에 따라 타입 분리
type EmailLoginRequest = {
  type: 'email';
  email: string;
  password: string;
};

type IdLoginRequest = {
  type: 'id';
  id: string;
  password: string;
};

// Union 타입으로 합치기
export type AuthRequest = EmailLoginRequest | IdLoginRequest;

// 로그인 응답 관련 타입
export interface AuthResponse {
  token: string;
  userType: UserType;
}

// 사용자 타입
export type UserType = 'user' | 'dispatch' | 'hospital' | 'control' | 'admin';

// 인증 상태 관련 타입
export interface AuthState {
  token: string | null;
  userType: UserType | null;
  isAuthenticated: boolean;
}

// 상태와 액션 모두 포함
export interface AuthStore extends AuthState {
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
}

// 에러 관련 타입
export interface AuthError {
  message: string;
  code: string;
}

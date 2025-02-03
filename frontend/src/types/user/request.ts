// 사용자 위치 정보 공유 동의 요청 인터페이스
export interface UserLocationConsentRequest {
  callId: number; // 특정 신고 건의 고유 식별자
  locationConsent: boolean; // 위치 정보 공유 동의 여부
}

// 사용자 위치 정보 인터페이스
export interface UserLocationRequest {
  latitude: number;
  longitude: number;
}

// 사용자 화상 통화 화면 공유 요청 인터페이스
export interface UserVideoCallShareRequest {
  roomId: number;
  videoCallUserCase: string;
}

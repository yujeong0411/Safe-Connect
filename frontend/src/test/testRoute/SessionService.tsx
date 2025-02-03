// SessionService.tsx
import axios from 'axios';

const APPLICATION_SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export interface User {
  nickname: string;
  role: 'runner' | 'chaser';
  profileImg?: string;
}

export interface SessionInfo {
  sessionId: string;
  token: string;
}

export interface SessionCreateRequest {
  customSessionId: string;
  metadata: string;
}
export class SessionService {
  // 세션 및 토큰 동시 생성
  // SessionService.tsx
  // SessionService.tsx
  // SessionService.tsx
  static createSafeSessionId(input: string): string {
    // 영숫자, 언더스코어, 하이픈만 남기고 나머지 제거
    return input
      .replace(/[^a-zA-Z0-9_-]/g, '')  // 허용되지 않는 문자 제거
      .substring(0, 50);  // 길이 제한 (선택적)
  }

  // SessionService.tsx
  static async createSessionAndToken(roomId: string): Promise<SessionInfo> {
    try {
      // 세션 생성
      const sessionResponse = await axios.post(
        `${APPLICATION_SERVER_URL}/api/sessions`,
        {
          customSessionId: this.createSafeSessionId(roomId + 'game')
        }
      );
      const sessionId = sessionResponse.data;

      // 연결 생성 (토큰 발급)
      const connectionResponse = await axios.post(
        `${APPLICATION_SERVER_URL}/api/sessions/${sessionId}/connections`,
        {} // 빈 객체로 요청
      );
      const token = connectionResponse.data;

      return {
        sessionId,
        token
      };
    } catch (error) {
      console.error('세션 및 토큰 생성 중 오류:', error);
      throw error;
    }
  }


  // 기존 메서드들은 제거하고 위 메서드로 대체

  // 랜덤 사용자 생성 메서드는 유지

}
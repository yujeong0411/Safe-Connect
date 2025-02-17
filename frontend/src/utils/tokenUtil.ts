interface DecodedToken {
    category: string;
    LoginId: string;
    role: string;
    iat: number;
    exp: number;
}

// 토큰 디코딩 함수
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        // JWT 토큰의 페이로드 부분 디코딩
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        console.error('토큰 디코딩 중 오류 발생:', error);
        return null;
    }
};

// 토큰 만료 확인 함수
export const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeToken(token);

    if (!decodedToken) {
        return true; // 디코딩 실패 시 만료된 것으로 간주
    }

    // 현재 시간과 토큰 만료 시간 비교 (초 단위)
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decodedToken.exp;
};

// 사용자 이메일(LoginId) 추출 함수
export const getLoginId = (token: string): string | null => {
    const decodedToken = decodeToken(token);
    return decodedToken ? decodedToken.LoginId : null;
};

// 사용자 역할(role) 추출 함수
export const getUserRole = (token: string): string | null => {
    const decodedToken = decodeToken(token);
    return decodedToken ? decodedToken.role : null;
};


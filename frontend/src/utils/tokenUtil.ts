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

// // 경로별 매핑
// export const PATH_ROLE_MAP = {
//     '/dispatch': 'ROLE_DISPATCH',
//     '/control': 'ROLE_CONTROL',
//     '/user': 'ROLE_USER',
//     '/hospital': 'ROLE_HOSP',
//     '/admin': 'ROLE_ADMIN'
// } as const;
//
// export const getBasePath = (pathname: string):string => {
//     // URL 경로에서 첫번째 세그먼트 추출
//     const match = pathname.match(/^(\/[^\/]+)/)
//     return match ? match[1] : '';
// }
//
// export const isValidPath = (token:string) : boolean => {
//     const decodedToken = decodeToken(token);
//     if (!decodedToken) return false;
//
//     // 현재 경로의 basepath 가져오기
//     const currentPath = getBasePath(window.location.pathname)
//
//     // 현재 경로에 허용된 role 가져오기
//     const expectedRole = PATH_ROLE_MAP[currentPath as keyof typeof PATH_ROLE_MAP];
//
//     // 경로에 특정 역할 매핑이 없는 경우 (예: 루트 경로 등) 통과
//     if (!expectedRole) return true;
//
//     // 토큰의 role이 현재 경로에 허용되는지 확인
//     // 서버의 role 값이 다른 형식일 수 있으므로 포함 여부로 체크
//     return decodedToken.role.includes(expectedRole) ||
//         expectedRole.includes(decodedToken.role);
// }
//
// // 각 role별 로그인 페이지 경로 매핑
// export const ROLE_LOGIN_PATH_MAP = {
//     'ROLE_CONTROL': '/control',
//     'ROLE_DISPATCH': '/dispatch',
//     'ROLE_USER': '/user/login',
//     'ROLE_HOSP': '/hospital',
//     'ROLE_ADMIN': '/admin'
// } as const;
//
// export const getLoginPath = (): string => {
//     const currentPath = getBasePath(window.location.pathname)
//     switch (currentPath) {
//         case '/dispatch':
//             return '/dispatch';
//         case '/control':
//             return '/control';
//         case '/user':
//             return '/user/login';
//         case '/hospital':
//             return '/hospital';
//         case '/admin':
//             return '/admin';
//         default:
//             // 현재 경로의 role을 찾을 수 없는 경우, 토큰이 있다면 토큰의 role 기반으로 리다이렉트
//             const token = sessionStorage.getItem('token');
//             if (token) {
//                 const decodedToken = decodeToken(token);
//
//
//                 if (decodedToken?.role) {
//                     return ROLE_LOGIN_PATH_MAP[decodedToken.role as keyof typeof ROLE_LOGIN_PATH_MAP];
//                 }
//             }
//             return '/'; // 기본 로그인 페이지 또는 메인 페이지
//     }
// };
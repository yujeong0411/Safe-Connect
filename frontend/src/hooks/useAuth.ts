import { useState, useEffect } from 'react';
import {decodeToken} from "@utils/tokenUtil.ts";

interface AuthState {
    userType: string | null;
    loginId: string | null;
    role: string | null;
    token: string | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        userType: null,
        loginId: null,
        role: null,
        token: null
    });

    // jwt 페이로드에서 정보 가져오기
    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token) {
            const decodedToken = decodeToken(token);

            if (decodedToken) {
                // 타입 결정
                const userType = decodedToken.role === 'ROLE_USER' ? 'user' : 'other';

                setAuthState({
                    userType,
                    loginId: decodedToken.LoginId,
                    role: decodedToken.role,
                    token
                })
            }
        }
    }, []);

    return authState;
};
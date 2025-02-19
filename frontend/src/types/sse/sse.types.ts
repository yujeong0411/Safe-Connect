// 기본 응답 타입 템플릿 생성
export interface BaseResponse<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    data: T;
}

export interface UseSSEProps<T> {
    subscribeUrl: string;
    clientId: number;
    onMessage: (data: BaseResponse<T>) => void;
    onError?: (error: unknown) => void; // unknown 타입 사용 권장
}


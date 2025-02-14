import { create } from 'zustand';

interface DispatchState {
    currentDispatch: any | null;   // 현재 출동 지령 데이터
    isVideoCallDrawerOpen: boolean;  // 비디오 drawer 상태

    setCurrentDispatch: (dispatch: any) => void;  // 출동 지령 데이터 설정
    setVideoCallDrawerOpen: (isOpen: boolean) => void;  // 비디오 통화 서랍 열림/닫힘 설정
}


export const useDispatchStore = create<DispatchState>((set) => ({
    // 초기 상태
    currentDispatch: null,  // 출동 없음.
    isVideoCallDrawerOpen: false,   // 닫힘 상태


    // 출동 지령 데이터 설정
    setCurrentDispatch: (dispatch) => set({
        currentDispatch: dispatch, // 출동 지령 데이터 저장
        isVideoCallDrawerOpen: true  // drawer 열기
    }),

    // 비디오 열기/닫기 설정
    setVideoCallDrawerOpen: (isOpen) => set({
        isVideoCallDrawerOpen: isOpen  // drawer 상태 변경
    })
}));
import { create } from 'zustand';

interface VideoDrawerState {
    isVideoDrawerOpen: boolean;
    setVideoDrawerOpen: (isOpen: boolean) => void;
}

export const useVideoDrawerStore = create<VideoDrawerState>((set) => ({
    isVideoDrawerOpen: false,
    setVideoDrawerOpen: (isOpen) => set({ isVideoDrawerOpen: isOpen }),
}));
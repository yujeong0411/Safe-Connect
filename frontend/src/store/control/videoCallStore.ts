import { create } from 'zustand'

interface VideoCallState {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    toggleDrawer: () => void
}

export const useVideoCallStore = create<VideoCallState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
}))
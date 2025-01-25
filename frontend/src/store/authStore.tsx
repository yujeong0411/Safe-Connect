import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@types/user/request';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export { useAuthStore };

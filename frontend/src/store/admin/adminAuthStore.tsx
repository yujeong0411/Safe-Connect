import { create } from 'zustand';
import { AdminAuthStore, AdminLoginRequest } from '@types/admin/adminAuth.types.ts';

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
}));

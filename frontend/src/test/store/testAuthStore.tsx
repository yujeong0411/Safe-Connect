import { create } from 'zustand';
import { TestStores } from '@/test/types/test.types.ts';
import { AxiosError } from 'axios';
import { axiosInstance } from '@utils/axios.ts';


export const testStore = create<TestStores>(() => ({
  createSession: async (sessionId: string) => {
    try {
      const response = await axiosInstance.post(`/api/sessions`, {
        customSessionId: sessionId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Session creation failed:', error.message);
        throw new Error(`Failed to create session: ${error.message}`);
      }
      throw error;
    }
  },

  createToken: async (sessionId: string) => {
    try {
      const response = await axiosInstance.post(`/api/sessions/${sessionId}/connections`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Token creation failed:', error.message);
        throw new Error(`Failed to create token: ${error.message}`);
      }
      throw error;
    }
  }
}));
import { create } from 'zustand';
import { TestStores } from '@/test/types/test.types.ts';
import { AxiosError } from 'axios';
import { axiosInstance } from '@utils/axios.ts';


// export const testStore = create<TestStores>(() => ({
//   createSession: async (sessionId: string) => {
//     try {
//       const response = await axiosInstance.post(`/api/sessions`, {
//         customSessionId: sessionId
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error('Session creation failed:', error.message);
//         throw new Error(`Failed to create session: ${error.message}`);
//       }
//       throw error;
//     }
//   },
//
//   createToken: async (sessionId: string) => {
//     try {
//       const response = await axiosInstance.post(`/api/sessions/${sessionId}/connections`, {}, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error('Token creation failed:', error.message);
//         throw new Error(`Failed to create token: ${error.message}`);
//       }
//       throw error;
//     }
//   }
// }));

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
        // 이미 존재하는 세션이라면 해당 세션 ID 반환
        if (error.response?.status === 409) {
          return sessionId;
        }
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
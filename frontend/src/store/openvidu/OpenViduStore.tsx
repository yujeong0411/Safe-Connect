import { create } from 'zustand';
import { openViduStore } from '@/types/openvidu/openvidu.types.ts';
import { AxiosError } from 'axios';
import { axiosInstance } from '@utils/axios.ts';
import { OpenVidu } from 'openvidu-browser';
import React from 'react';


export const useOpenViduStore =
  create<openViduStore>((set,get) => ({

  OV: new OpenVidu(),
  sessionId: '',
  userName: `Guest_${Math.floor(Math.random() * 100)}`,
  session: undefined,
  mainStreamManager: undefined,
  publisher: undefined,
  subscribers: [],
  localUser: {
    connectionId: undefined,
    streamManager: undefined,
    userName: undefined,
  },

  handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ sessionId: e.target.value });
  },
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ userName: e.target.value });
  },

  // handleMainVideoStream: (stream: StreamManager) => {
  //   set({ mainStreamManager: stream });
  // },


    createAndJoinSession: async (e: React.FormEvent) => {
      e.preventDefault();
      const { sessionId, createSession, joinSession } = get();

      try {
        await createSession(sessionId);
        // sessionId를 설정한 후 joinSession 호출
        set({ sessionId });
        await joinSession();
      } catch (error) {
        console.error('Session creation failed:', error);
        set({ sessionId: '' });
        throw error;
      }
    },

    joinSession: async () => {
      const { OV, sessionId, userName } = get();
      if (!sessionId) return;

      try {
        const session = OV.initSession();

        // 이벤트 핸들러 설정
        session.on('streamCreated', (event) => {
          const subscriber = session.subscribe(event.stream, undefined);
          set((state) => ({
            subscribers: [...state.subscribers, subscriber],
          }));
        });

        session.on('streamDestroyed', (event) => {
          set((state) => ({
            subscribers: state.subscribers.filter(
              sub => sub !== event.stream.streamManager
            ),
          }));
        });

        // 연결 시도
        const token = await get().createToken(sessionId);
        await session.connect(token, { clientData: userName });

        // 퍼블리셔 초기화
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        // 세션에 퍼블리시
        await session.publish(publisher);
        const localUser = {
          connectionId: session.connection.connectionId,
          streamManager: publisher,
          userName: userName,
        };
        set({
          session,
          mainStreamManager: publisher,
          publisher,
          localUser: localUser,
        });

      } catch (error) {
        console.error('Session join failed:', error);
        // 실패 시 상태 초기화
        set({
          session: undefined,
          mainStreamManager: undefined,
          publisher: undefined,
          subscribers: [],
          localUser: {
            connectionId: undefined,
            streamManager: undefined,
            userName: undefined,
          },
        });
        throw error;
      }
    },

    leaveSession: () => {
      const { session, publisher } = get();

      if (session) {
        try {
          // 퍼블리셔 정리
          if (publisher) {
            session.unpublish(publisher);
          }
          // 세션 연결 해제
          session.disconnect();
        } catch (err) {
          console.error('Error leaving session:', err);
        }
      }

      // 상태 초기화
      set({
        session: undefined,
        mainStreamManager: undefined,
        publisher: undefined,
        subscribers: [],
        sessionId: '',
        userName: `Guest_${Math.floor(Math.random() * 100)}`,
      });
    },
// axios 쓰는 코드
  createSession: async (sessionId: string) => {
    try {
      const response = await axiosInstance.post(
        `/api/sessions`,
        {
          customSessionId: sessionId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
      const response = await axiosInstance.post(
        `/api/sessions/${sessionId}/connections`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Token creation failed:', error.message);
        throw new Error(`Failed to create token: ${error.message}`);
      }
      throw error;
    }
  },
}));
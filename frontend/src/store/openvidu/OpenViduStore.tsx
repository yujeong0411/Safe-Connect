import { create } from 'zustand';
import { openViduStore, OpenViduState } from '@/types/openvidu/openvidu.types.ts';
import { AxiosError } from 'axios';
import { axiosInstance } from '@utils/axios.ts';
import { OpenVidu } from 'openvidu-browser';
import React from 'react';
import {usePatientStore} from "@/store/control/patientStore.tsx";

// 더 강력한 브라우저 체크 우회
const forceOverrideBrowserCheck = () => {
  // UserAgent 변경
  Object.defineProperty(navigator, 'userAgent', {
    get: function() {
      return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    },
    configurable: true
  });

  // Platform 변경
  Object.defineProperty(navigator, 'platform', {
    get: function() {
      return 'MacIntel';
    },
    configurable: true
  });

  // vendor 변경
  Object.defineProperty(navigator, 'vendor', {
    get: function() {
      return 'Google Inc.';
    },
    configurable: true
  });
};

// 초기 상태
const initialState: OpenViduState = {
  isActive: false,
  callId : undefined,
  OV: undefined,
  sessionId: '',
  userName: `Guest_${Math.floor(Math.random() * 100)}`,
  session: undefined,
  mainStreamManager: undefined,
  publisher: null,
  subscribers: [],
  localUser: {
    connectionId: undefined,
    streamManager: undefined,
    userName: undefined,
  },
  callStartedAt: '',   // 신고시각
  callerPhone:'',
  fireStaffId:undefined,

};

export const useOpenViduStore = create<openViduStore>((set, get) => ({
  ...initialState,

  setSessionId: (newSessionId: string) => {
    set({ sessionId: newSessionId });
  },

  setUserName: (newUserName: string) => {
    set({ userName: newUserName });
  },
    handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => {
      set({ sessionId: e.target.value });
    },

  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ userName: e.target.value });
  },

  setSessionActive: (active: boolean) => {
    set({ isActive: active });
  },

  createAndJoinSession: async (e: React.FormEvent,callerPhone : string) => {
    e.preventDefault();

    if (!callerPhone) {
      alert('전화번호를 입력해주세요.');
      return;
    }

    // 컴포넌트가 시작할 떄가 아니라, 영상통화방이 만들어질때 Openvidu 객체 생성
    const OV = new OpenVidu();
    OV.enableProdMode();
    set({ OV });

    // 브라우저 체크 우회를 먼저 적용
    forceOverrideBrowserCheck();

    const { sessionId, userName, createSession, joinSession } = get();

    if (!userName || userName === '') {
      throw new Error('사용자 이름이 설정되지 않았습니다.');
    }

    try {
      await createSession(sessionId,callerPhone);
      // 세션 제작 성공
      console.log("세션제작 성공")
      set({ sessionId });
      await joinSession();
    } catch (error) {
      console.error('Session creation failed:', error);
      set({ sessionId: '' });
      throw error;
    }
  },

  joinSession: async () => {
    try {
      // OpenVidu 초기화 전에 브라우저 체크 우회
      forceOverrideBrowserCheck();

      const OV = new OpenVidu();
      OV.enableProdMode();  // 프로덕션 모드 활성화
      set({ OV });

      const { sessionId, userName } = get();
      if (!sessionId) return;

      const session = OV.initSession();

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
      console.log("Session connected with token:", token);

      // iOS에 최적화된 설정으로 퍼블리셔 초기화
      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '320x240',    // 낮은 해상도
        frameRate: 15,            // 낮은 프레임레이트
        insertMode: 'APPEND',
        mirror: false,
      });

      await session.publish(publisher);

      console.log("Publisher created:", publisher);

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
        isActive: true
      });

    } catch (error) {
      console.error('Session join failed:', error);
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
        isActive: false
      });
      throw error;
    }
  },

  leaveSession: () => {
    const { session, publisher } = get();

    if (session) {
      try {
        if (publisher) {
          const mediaStream = publisher.stream.getMediaStream();
          if (mediaStream) {
            mediaStream.getTracks().forEach(track => {
              track.stop();
            });
          }
          session.unpublish(publisher);
        }
        session.disconnect();
      } catch (err) {
        console.error('Error leaving session:', err);
      }
    }
    
    // patientStore에서 데이터 초기화 메서드 호출 : 통화 종료 시 환자 데이터 초기화
    usePatientStore.getState().resetPatientInfo()

    set({
      ...initialState
    });
  },

  createSession: async (sessionId: string, callerPhone : string) => {
    try {
      const response = await axiosInstance.post(
        `/control/video`,
        {
          customSessionId: sessionId,
          callerPhone:callerPhone
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Create Session Response:', response.data);

      set({
        callId: response.data.data.call.callId as number,
        callStartedAt: response.data.data.call.callStartedAt,
        callerPhone:response.data.data.call.caller.callerPhone,
        fireStaffId: response.data.data.call.fireStaff.fireStaffId,
      })
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
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
          headers: { 'Content-Type': 'application/json' },
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
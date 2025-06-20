import { create } from 'zustand';
import { openViduStore, OpenViduState } from '@/types/openvidu/openvidu.types.ts';
import { AxiosError } from 'axios';
import { axiosInstance } from '@utils/axios.ts';
import { OpenVidu } from 'openvidu-browser';
import React from 'react';
import { usePatientStore } from "@/store/control/patientStore.tsx";
import  useRecorderStore  from '@/store/openvidu/MediaRecorderStore.tsx';


const { startRecording, initializeRecorder} = useRecorderStore.getState();

// 더 강력한 브라우저 체크 우회
const forceOverrideBrowserCheck = () => {
  // UserAgent 변경
  Object.defineProperty(navigator, 'userAgent', {
    get: function () {
      return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    },
    configurable: true
  });

  // Platform 변경
  Object.defineProperty(navigator, 'platform', {
    get: function () {
      return 'MacIntel';
    },
    configurable: true
  });

  // vendor 변경
  Object.defineProperty(navigator, 'vendor', {
    get: function () {
      return 'Google Inc.';
    },
    configurable: true
  });
};

// 초기 상태
const initialState: OpenViduState = {
  isActive: false,
  callId: undefined,
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
  callerPhone: '',
  fireStaffId: undefined,
  recordingInterval: null as NodeJS.Timeout | null,

};

export const useOpenViduStore = create<openViduStore>((set, get) => ({
  ...initialState,


  setSessionId: (newSessionId: string) => {
    set({ sessionId: newSessionId });
  },

  handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => { // 이 부분이 sessionId 수정
    set({ sessionId: e.target.value });

  },

  setUserName: (newUserName: string) => {
    set({ userName: newUserName });
  },

  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ userName: e.target.value });
  },

  setSessionActive: (active: boolean) => {
    set({ isActive: active });
  },

  createAndJoinSession: async (e: React.FormEvent, callerPhone: string) => {
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
      await createSession(sessionId, callerPhone);
      // 세션 제작 성공
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


      session.on('streamCreated', async (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        set((state) => ({
          subscribers: [...state.subscribers, subscriber],
        }));

        // 녹음이 아직 시작되지 않았을 때만 초기화 및 시작
        //const recorderStore = useRecorderStore.getState();
    
        // 구독자의 스트림이 실제로 재생 가능할 때까지 대기
        await new Promise<void>(resolve => {
          subscriber.on('streamPlaying', () => {
            resolve();
          });
        });


          await initializeRecorder(subscriber);
          await startRecording();

          // 60초 사이클로 녹음 중지 -> 서버로 전송 -> 다시 녹음 시작
          const interval = setInterval(async () => {
            const blob = await useRecorderStore.getState().stopRecording();
            console.log('Recording stopped:', blob);

            // 녹음 파일 전송
            await usePatientStore.getState().fetchCallSummary(Number(get().callId), blob);

            //await initializeRecorder(subscriber);
            await startRecording();
          }, 60000);

          set({recordingInterval: interval });
      });

      session.on('streamDestroyed', async (event) => {
        set((state) => ({
          subscribers: state.subscribers.filter(
            sub => sub !== event.stream.streamManager
          ),
        }));

        // interval 종료
        const { recordingInterval } = get();
        if (recordingInterval) {
          clearInterval(recordingInterval);
          set({ recordingInterval: null });

          console.log('Recording interval 종료');

          await useRecorderStore.getState().stopRecording(); // 녹음도 더이상 안되게 종료.
        }
      });

     
      // 연결 시도
      const token = await get().createToken(sessionId);
      await session.connect(token, { clientData: userName });

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

  leaveSession: async() => {
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

        try {
          axiosInstance.post(`/api/sessions/${session.sessionId}/disconnect`);
        } catch (error) {
          console.error('Error notifying server about disconnection:', error);
        }

        session.disconnect();
      } catch (err) {
        console.error('Error leaving session:', err);
      }

      // interval 종료
      const { recordingInterval } = get();
      if (recordingInterval) {
        clearInterval(recordingInterval);
        set({ recordingInterval: null });

        console.log('Recording interval 종료');

        await useRecorderStore.getState().stopRecording(); // 녹음도 더이상 안되게 종료.
      }

    }
    // patientStore에서 데이터 초기화 메서드 호출 : 통화 종료 시 환자 데이터 초기화
    usePatientStore.getState().resetPatientInfo()
    set({
      ...initialState
    });
  },

  dispatchJoinSession: async () => {
    try {
      // OpenVidu 초기화 전에 브라우저 체크 우회
      forceOverrideBrowserCheck();

      const OV = new OpenVidu();
      OV.enableProdMode();  // 프로덕션 모드 활성화
      set({ OV });

      const { sessionId, userName } = get();

      if (!sessionId) return;

      const session = OV.initSession();


      session.on('streamCreated', async (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        set((state) => ({
          subscribers: [...state.subscribers, subscriber],
        }));
      });

      session.on('streamDestroyed', async (event) => {
        set((state) => ({
          subscribers: state.subscribers.filter(
            sub => sub !== event.stream.streamManager
          ),
        }));
      });
      // 연결 시도
      const token = await get().createToken(sessionId);
      await session.connect(token, { clientData: userName });

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

  dispatchLeaveSession: async() => {
    const { session, publisher } = get();
    // 환자 정보 초기화 필요 x

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

        try {
          axiosInstance.post(`/api/sessions/${session.sessionId}/disconnect`);
        } catch (error) {
          console.error('Error notifying server about disconnection:', error);
        }

        session.disconnect();
      } catch (err) {
        console.error('Error leaving session:', err);
      }

    }
    // 확인 필요
    set({
      ...initialState
    });
  },

  createSession: async (sessionId: string, callerPhone: string) => {
    try {
      const response = await axiosInstance.post(
        `/control/video`,
        {
          customSessionId: sessionId,
          callerPhone: callerPhone
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      set({
        callId : response.data.data.call.callId,
        callStartedAt: response.data.data.call.callStartedAt,
        callerPhone: response.data.data.call.caller.callerPhone,
        fireStaffId: response.data.data.call.fireStaff.fireStaffId,
      })
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          set({ sessionId });
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
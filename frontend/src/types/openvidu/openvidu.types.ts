import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import React from 'react';

export interface LocalUser {
  connectionId: string | undefined;
  streamManager: StreamManager | undefined;
  userName: string | undefined;
}

export interface openViduStore {
  // State
  callId : number | undefined;
  isActive : boolean
  OV: OpenVidu | undefined;
  sessionId: string;
  userName: string;
  session: Session | undefined;
  mainStreamManager: StreamManager | undefined;
  publisher: Publisher | null;
  subscribers: Subscriber[];
  localUser: LocalUser
  callStartedAt:string
  callerPhone:string
  fireStaffId:number | undefined;
  recordingInterval: NodeJS.Timeout | null;

  // Actions
  setSessionId:(newSessionId:string) => void;
  setUserName:(newUserName:string) => void;
  handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  joinSession: () => Promise<void>;
  leaveSession: () => void;
  setSessionActive: (active: boolean) => void;
  // switchCamera: () => void;
  // handleMainVideoStream: (stream: StreamManager) => void;
  createSession: (sessionId: string,callerPhone:string) => Promise<any>;
  createToken: (sessionId: string) => Promise<any>;
  createAndJoinSession: (e: React.FormEvent,callerPhone:string)=> Promise<void>;
}

export interface OpenViduState {
  isActive: boolean,
  callId: number | undefined,
  OV: OpenVidu | undefined,
  sessionId: string,
  userName: string,
  session: Session | undefined,
  mainStreamManager: StreamManager | undefined,
  publisher: Publisher | null,
  subscribers: Subscriber[],
  localUser: LocalUser,
  callStartedAt: string,   // 신고시각
  callerPhone: string,
  fireStaffId: number | undefined,
  recordingInterval: NodeJS.Timeout | null
}


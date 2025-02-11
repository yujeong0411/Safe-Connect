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
  OV: OpenVidu;
  sessionId: string;
  userName: string;
  session: Session | undefined;
  mainStreamManager: StreamManager | undefined;
  publisher: Publisher | null;
  subscribers: Subscriber[];
  localUser: LocalUser

  // Actions
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

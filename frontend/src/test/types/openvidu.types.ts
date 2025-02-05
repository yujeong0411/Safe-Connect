import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import React from 'react';

export interface openViduStore {
  // State
  OV: OpenVidu;
  sessionId: string;
  userName: string;
  session: Session | undefined;
  mainStreamManager: StreamManager | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];

  // Actions
  handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  joinSession: () => Promise<void>;
  leaveSession: () => void;
  // switchCamera: () => void;
  handleMainVideoStream: (stream: StreamManager) => void;
  createSession: (sessionId: string) => Promise<any>;
  createToken: (sessionId: string) => Promise<any>;
  createAndJoinSession: (e: React.FormEvent)=> Promise<void>;
}

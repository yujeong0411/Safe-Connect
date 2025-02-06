import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';

export interface OpenViduTemplateStore {

  OV: OpenVidu;
  mySessionId: string;
  myUserName: string;
  session: Session | undefined;
  mainStreamManager: StreamManager | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];

}

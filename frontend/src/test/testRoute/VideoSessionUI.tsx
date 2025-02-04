import React from 'react';
import UserVideoComponent from './UserVideoComponent';
import { StreamManager, Session, Publisher, Subscriber } from 'openvidu-browser';
import Button from '@components/atoms/Button/Button.tsx';
import Input from '@components/atoms/Input/Input.tsx';

interface VideoSessionUIProps {
  session: Session | undefined;
  mySessionId: string;
  myUserName: string;
  mainStreamManager: StreamManager | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  handleChangeSessionId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeUserName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  joinSession: (e: React.FormEvent<HTMLFormElement>) => void;
  leaveSession: () => void;
  switchCamera: () => void;
  handleMainVideoStream: (stream: StreamManager) => void;
}

const VideoSessionUI: React.FC<VideoSessionUIProps> = ({
                                                         session,
                                                         mySessionId,
                                                         myUserName,
                                                         mainStreamManager,
                                                         publisher,
                                                         subscribers,
                                                         handleChangeSessionId,
                                                         handleChangeUserName,
                                                         joinSession,
                                                         leaveSession,
                                                         switchCamera,
                                                         handleMainVideoStream
                                                       }) => {
  return (
    <div className="container">
      {session === undefined ? (
        <div id="join">
          <div id="img-div">
            <img src="src/test/sources/Cat01.webp" alt="OpenVidu logo" />
          </div>
          <div id="join-dialog" className="jumbotron vertical-center">
            <h1> Join a video session </h1>
            <form className="form-group" onSubmit={joinSession}>
              <p>
                <label>Participant: </label>
                {/*만일 user이면 User_Role과 loginId를 이용해서 username을 만든다. 나중 이야기...*/}
                <Input
                  id="userName"
                  type="text"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  width="full"
                  variant="blue"
                  isRequired// 필수 필드
                />
              </p>
              <p>
                {/*생성 시간이랑 해서 보내면 back에서 만들어 받아와야한다.*/}
                <label> Session: </label>
                <Input
                  id="sessionId"
                  type="text"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  width="full"
                  variant="blue"
                  isRequired// 필수 필드
                />
              </p>
              <p className="text-center">
                <Button
                  type="submit"
                  variant="blue"
                  width="full"
                  className="mb-3"
                  onClick={leaveSession}
                >
                  JOIN
                </Button>
              </p>
            </form>
          </div>
        </div>
      ) : null}

      {/*세션 정의 여부 확인*/}
      {session !== undefined ? (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{mySessionId}</h1>
            <Button
              variant="blue"
              width="full"
              className="mb-3"
              onClick={leaveSession}
            >
              Leave session
            </Button>
            <Button
              variant="blue"
              width="full"
              className="mb-3"
              onClick={switchCamera}
            >
              Switch Camera
            </Button>
          </div>

          {/*mainStream이 있으면 UserVideoComponent가 작동하고, 아니면 null*/}
          {mainStreamManager !== undefined ? (
            <div id="main-video" className="col-md-6">
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
          <div id="video-container" className="col-md-6">
            {publisher !== undefined ? (
              <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                <UserVideoComponent streamManager={publisher} />
              </div>
            ) : null}
            {subscribers.map((sub) => (
              <div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(sub)}>
                <span>{sub.id}</span>
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VideoSessionUI;
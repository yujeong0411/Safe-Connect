import { OpenVidu, Publisher, Session, StreamManager, Subscriber } from 'openvidu-browser';
import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import VideoSessionUI from './VideoSessionUI';

const APPLICATION_SERVER_URL = 'http://localhost:8080/';

interface Device {
  deviceId: string;
  kind: string;
  label: string;
}

interface State {
  mySessionId: string;
  myUserName: string;
  session: Session | undefined;
  mainStreamManager: StreamManager | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  currentVideoDevice?: Device;
}

class TestPage extends Component<{}, State> {

  private OV: OpenVidu | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  onbeforeunload() {
    this.leaveSession();
  }

  handleChangeSessionId(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream: StreamManager) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream
      });
    }
  }

  deleteSubscriber(streamManager: StreamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager as Subscriber, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        const mySession = this.state.session;
        if (mySession) {
          mySession.on('streamCreated', (event) => {
            const subscriber = mySession.subscribe(event.stream, undefined);
            const subscribers = this.state.subscribers;
            subscribers.push(subscriber);

            this.setState({
              subscribers: subscribers,
            });
          });

          mySession.on('streamDestroyed', (event) => {
            this.deleteSubscriber(event.stream.streamManager);
          });

          mySession.on('exception', (exception) => {
            console.warn(exception);
          });

          this.getToken()
            .then(async (token) => {
              try {
                await mySession.connect(token, { clientData: this.state.myUserName });

                if (!this.OV) {
                  console.log("ov가 null입니다.")
                  return;
                }

                const publisher = await this.OV.initPublisherAsync(undefined, {
                  audioSource: undefined,
                  videoSource: undefined,
                  publishAudio: true,
                  publishVideo: true,
                  resolution: '640x480',
                  frameRate: 30,
                  insertMode: 'APPEND',
                  mirror: false,
                });

                await mySession.publish(publisher);

                const devices = await this.OV.getDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                this.setState({
                  currentVideoDevice: currentVideoDevice,
                  mainStreamManager: publisher,
                  publisher: publisher,
                });
              } catch (error: any) {
                console.log('There was an error connecting to the session:', error.code, error.message);
              }
            });
        }
      },
    );
  }

  leaveSession() {
    const mySession = this.state.session;
    if (mySession) {
      mySession.disconnect();
    }
    this.OV = null;

    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined
    });
  }

  async switchCamera() {
    if (!this.OV) {
      return;
    }

    try {
      const devices = await this.OV.getDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1 && this.state.currentVideoDevice) {
        const newVideoDevice = videoDevices.filter(device => device.deviceId !== this.state.currentVideoDevice?.deviceId);

        if (newVideoDevice.length > 0) {
          const newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true
          });

          if (this.state.session && this.state.mainStreamManager) {
            await this.state.session.unpublish(this.state.mainStreamManager as Publisher);
            await this.state.session.publish(newPublisher);
            this.setState({
              currentVideoDevice: newVideoDevice[0],
              mainStreamManager: newPublisher,
              publisher: newPublisher,
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId: string) {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data;
  }

  async createToken(sessionId: string) {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data;
  }

  render() {
    return (
      <VideoSessionUI
        session={this.state.session}
        mySessionId={this.state.mySessionId}
        myUserName={this.state.myUserName}
        mainStreamManager={this.state.mainStreamManager}
        publisher={this.state.publisher}
        subscribers={this.state.subscribers}
        handleChangeSessionId={this.handleChangeSessionId}
        handleChangeUserName={this.handleChangeUserName}
        joinSession={this.joinSession}
        leaveSession={this.leaveSession}
        switchCamera={this.switchCamera}
        handleMainVideoStream={this.handleMainVideoStream}
      />
    );
  }
}

export default TestPage;
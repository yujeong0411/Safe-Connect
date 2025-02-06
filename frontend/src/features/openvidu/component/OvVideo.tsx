import React, { Component } from 'react';
import { StreamManager } from 'openvidu-browser';

interface Props {
    streamManager: StreamManager;
}

export default class OpenViduVideoComponent extends Component<Props> {
    private videoRef: React.RefObject<HTMLVideoElement>;

    constructor(props: Props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.streamManager && this.videoRef.current) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.streamManager !== this.props.streamManager) {
            if (this.props.streamManager && this.videoRef.current) {
                this.props.streamManager.addVideoElement(this.videoRef.current);
            }
        }
    }

    render() {
        return (
          <video
            autoPlay={true}
            ref={this.videoRef}
            style={{ width: '100%', height: 'auto' }}
            playsInline
          />
        );
    }
}
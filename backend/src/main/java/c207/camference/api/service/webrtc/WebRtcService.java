package c207.camference.api.service.webrtc;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.springframework.http.ResponseEntity;

public interface WebRtcService {
    ResponseEntity<?> sendUrlMsg(String callerPhone) throws OpenViduJavaClientException, OpenViduHttpException;
}

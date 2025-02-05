package c207.camference.api.service.webrtc;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface WebRtcService {
    ResponseEntity<?> sendUrlMsg(String callerPhone) throws OpenViduJavaClientException, OpenViduHttpException;
    String speechToText(MultipartFile audioFile) throws IOException;
    String textSummary(String speechToText);
    String createStaffToken(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException;

}

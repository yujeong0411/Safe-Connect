package c207.camference.api.service.webrtc;

import c207.camference.api.request.dispatchstaff.PreKtasRequest;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface WebRtcService {
    // ResponseEntity<?> sendUrlMsg(String callerPhone) throws OpenViduJavaClientException, OpenViduHttpException;
    String speechToText(MultipartFile audioFile) throws IOException;
    String textSummary(String speechToText,String addSummary);
    ResponseEntity<?> saveSummary(Integer callId, String text, String summary);

    String makeSession(String customSessionId) throws OpenViduJavaClientException, OpenViduHttpException;
    String makeUrl(String sessionId);
    Integer getPreKtas(PreKtasRequest request);
}

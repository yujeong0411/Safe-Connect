package c207.camference.api.contoller.webrtc;

import c207.camference.api.service.fireStaff.ControlService;
import c207.camference.api.service.webrtc.WebRtcService;
import c207.camference.api.service.webrtc.WebRtcServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

import java.util.*;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import org.springframework.web.multipart.MultipartFile;

//@CrossOrigin(origins = "*")
@RestController
public class WebRtcController {
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private WebRtcService webRtcService;
    private ControlService controlService;

    public WebRtcController(WebRtcService webRtcService,
                            ControlService controlService) {

        this.webRtcService = webRtcService;
        this.controlService = controlService;
    }

    @PostConstruct
    public void init() {

        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
        this.webRtcService = webRtcService;
    }



    /**
     * @param params The Session properties
     * @return The Session ID
     */
    @PostMapping("/api/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        System.out.println(params);

        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);
        System.out.println(session.getSessionId()); // 테스트용

        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    /**
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties
     * @return The Token associated to the Connection
     */
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println(params);
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);
        System.out.println(connection.getToken());

        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }



    @PostMapping("/control/whisper")
    public ResponseEntity<?> sendUrl(@RequestParam("audioFile") MultipartFile audioFile) throws IOException {

        String text = webRtcService.speechToText(audioFile); // 음성파일 텍스트로 변환
        String summary = webRtcService.textSummary(text);

        System.out.println("요약전 : " + text); // 테스트용.
        System.out.println("요약 후 : " + summary);

//        controlService.updateCall(text);
//        controlService.updateCall(summary);

        Map<String, String> response = new HashMap<>();
        response.put("text", text);
        response.put("summary", summary);

        return ResponseEntity.ok(response);
    }

    // 영상통화방 URL 전송
    // 이때 신고자(caller), 신고 테이블(call), 영상통화(video_call),영상통화참여(video_call_user) insert
    //
    @PostMapping("/control/video")
    public ResponseEntity<?> sendUrl(@RequestParam("callerPhone") String callerPhone) throws OpenViduJavaClientException, OpenViduHttpException {
        webRtcService.sendUrlMsg(callerPhone); //영상통화방 URL 전송

        // 신고자 컬럼 생성

        //



        return ResponseEntity.ok().build();
    }

}

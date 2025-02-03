package c207.camference.api.contoller.webrtc;

import c207.camference.api.service.webrtc.WebRtcService;
import io.openvidu.java.client.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

//@CrossOrigin(origins = "*")
@RestController
@Log4j2
public class WebRtcController {
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private WebRtcService webRtcService;

    public WebRtcController(WebRtcService webRtcService) {
        this.webRtcService = webRtcService;
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
        System.out.println(connection.getConnectionId());

        // 테스트용으로 우선 여기에 넣었다.
        // webRtcService.sendUrlMsg("01028372243");

        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    @PostMapping("/control/whisper")
    public ResponseEntity<?> sendUrl(@PathVariable("sessionId") String sessionId,
                                     @RequestParam("audioFile") MultipartFile audioFile) throws IOException {

        String text = webRtcService.speechToText(audioFile);
        System.out.println(text);

        return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.CREATED);
    }


    /**
     * @param sessionId
     * @param params
     * @return
     */
//    @PostMapping("/control/video")
//    public ResponseEntity<String> sendUrl(@PathVariable("sessionId") String sessionId,
//                                                   @RequestBody(required = false) Map<String, Object> params)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//
//        webRtcService.sendUrlMsg("01028372243");
//
//        return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.CREATED);
//    }


}

package c207.camference.api.contoller.webrtc;

import c207.camference.api.service.webrtc.WebRtcService;
import c207.camference.api.service.webrtc.WebRtcServiceImpl;
import c207.camference.api.service.fireStaff.ControlService;
import c207.camference.api.service.webrtc.WebRtcService;
import io.openvidu.java.client.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
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
import java.util.stream.Collectors;

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

        String customSessionId = params != null ? (String) params.get("customSessionId") : null;

        SessionProperties properties = new SessionProperties.Builder()
                .customSessionId(customSessionId)
                .build();

        Session session = openvidu.createSession(properties);
        System.out.println(session.getSessionId()); // 테스트용

        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            session = openvidu.createSession(
                    new SessionProperties.Builder()
                            .customSessionId(sessionId)
                            .build()
            );
        }

        ConnectionProperties properties = new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .data("") // 필요하다면 사용자 데이터 추가 가능
                .build();

        Connection connection = session.createConnection(properties);
        System.out.println(connection.getToken());

        System.out.println(connection.getConnectionId());

        // 테스트용으로 우선 여기에 넣었다.
        // webRtcService.sendUrlMsg("01028372243");

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



    @PostMapping("/api/sessions/{sessionId}/disconnect")
    public ResponseEntity<String> disconnectSession(@PathVariable("sessionId") String sessionId)
            throws OpenViduJavaClientException, OpenViduHttpException {

        Session session = openvidu.getActiveSession(sessionId);

        if (session != null) {
            // 세션의 모든 연결 종료
            session.close();

            return ResponseEntity.ok("Session closed successfully");
        }

        return ResponseEntity.notFound().build();
    }
    @GetMapping("/api/sessions")
    public ResponseEntity<List<String>> getAllActiveSessions()
            throws OpenViduJavaClientException, OpenViduHttpException {

        // 활성 세션 목록 가져오기
        List<Session> activeSessions = openvidu.getActiveSessions();

        // 세션 ID 목록 추출
        List<String> sessionIds = activeSessions.stream()
                .map(Session::getSessionId)
                .collect(Collectors.toList());

        // 세션 ID 목록 반환
        return ResponseEntity.ok(sessionIds);
    }

    @DeleteMapping("/api/sessions/disconnect")
    public ResponseEntity<String> deleteAllActiveSessions() {
        try {
            List<Session> activeSessions = openvidu.getActiveSessions();
            for (Session session : activeSessions) {
                try {
                    session.close();
                } catch (OpenViduHttpException e) {
                    if (e.getStatus() != 404) throw e;
                    // 404 에러는 무시
                }
            }
            List<String> closedSessionIds = activeSessions.stream()
                    .map(Session::getSessionId)
                    .collect(Collectors.toList());

            return ResponseEntity.ok("Closed sessions: " + closedSessionIds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to close sessions: " + e.getMessage());
        }
    }

}

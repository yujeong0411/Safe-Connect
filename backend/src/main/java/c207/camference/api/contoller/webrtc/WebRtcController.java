package c207.camference.api.contoller.webrtc;


import c207.camference.api.service.fireStaff.ControlService;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.webrtc.WebRtcService;
import c207.camference.db.entity.call.Caller;
import c207.camference.db.entity.call.VideoCall;
import c207.camference.db.entity.call.VideoCallUser;
import c207.camference.db.entity.firestaff.FireStaff;
import c207.camference.db.repository.call.CallerRepository;
import c207.camference.db.repository.call.VideoCallRepository;
import c207.camference.db.repository.call.VideoCallUserRepository;
import c207.camference.db.repository.firestaff.FireStaffRepository;
import io.openvidu.java.client.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//@CrossOrigin(origins = "*")
@RestController
@Log4j2
public class WebRtcController {
    private final SmsService smsService;
    private final VideoCallRepository videoCallRepository;
    private final CallerRepository callerRepository;
    private final VideoCallUserRepository videoCallUserRepository;
    private final FireStaffRepository fireStaffRepository;
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private WebRtcService webRtcService;
    private final ControlService controlService;

    public WebRtcController(WebRtcService webRtcService,
                            ControlService controlService, SmsService smsService, VideoCallRepository videoCallRepository, CallerRepository callerRepository, VideoCallUserRepository videoCallUserRepository, FireStaffRepository fireStaffRepository) {

        this.webRtcService = webRtcService;
        this.controlService = controlService;
        this.smsService = smsService;
        this.videoCallRepository = videoCallRepository;
        this.callerRepository = callerRepository;
        this.videoCallUserRepository = videoCallUserRepository;
        this.fireStaffRepository = fireStaffRepository;
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
    // 세션 생성(상황실)
    @PostMapping("/api/sessions")
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        // 상황실 직원만 해당 컨트롤러에 접근을 한다. 따라서 URL을 문자메시지로 전송하는 로직도 여기서 구현한다.

        String customSessionId = params != null ? (String) params.get("customSessionId") : null;
        String callerPhone = (String) params.get("callerPhone");

        SessionProperties properties = new SessionProperties.Builder()
                .customSessionId(customSessionId)
                .build();

        Session session = openvidu.createSession(properties);

        // 만들어진 URL을 문자로 전송
        // 상황실 컨트롤러에서 전송? 여기서 전송?
        String URL = "http://localhost:5173/caller/join/" + customSessionId + "?direct=true";
        smsService.sendMessage(callerPhone, URL);
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    // 토큰 생성(상황실, 신고자, 구급대원)
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        VideoCall videoCall = videoCallRepository.findByVideoCallSessionId(sessionId);
        VideoCallUser videoCallUser = new VideoCallUser();
        if (fireStaffLoginId == null|| fireStaffLoginId.equals("anonymousUser")) {
            Caller caller = callerRepository.findByCallerSessionId(sessionId);
            videoCallUser.setVideoCallId(videoCall.getVideoCallId());
            videoCallUser.setVideoCallUserCategory("G");
            videoCallUser.setVideoCallerId(caller.getCallerId()); // 상황실 직원의 아이디가 들어가야 한다.
            videoCallUserRepository.save(videoCallUser);
        }else if(fireStaffLoginId.startsWith("E")){
            FireStaff fireStaff = fireStaffRepository.findFireStaffByFireStaffLoginId(fireStaffLoginId);
            videoCallUser.setVideoCallId(videoCall.getVideoCallId());
            videoCallUser.setVideoCallUserCategory("E");
            videoCallUser.setVideoCallerId(fireStaff.getFireStaffId()); // 상황실 직원의 아이디가 들어가야 한다.
            videoCallUserRepository.save(videoCallUser);
        }
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


        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }




    @PostMapping("/control/summary")
    public ResponseEntity<?> sendUrl(
            @RequestParam("callId") String callId,
            @RequestParam("audioFile") MultipartFile audioFile,
            @RequestParam("addSummary") String addSummary) throws IOException {
        System.out.println("callId : " + callId);
        String text = webRtcService.speechToText(audioFile); // 음성파일 텍스트로 변환
        System.out.println("text: " + text);
        String summary = webRtcService.textSummary(text,addSummary);
        System.out.println("summary : " + summary);
        ResponseEntity<?> response = webRtcService.saveSummary(Integer.parseInt(callId), text, summary);
        System.out.println("contol/summary - response : " + response);


        return response;
    }


    @PostMapping("/api/sessions/{sessionId}/disconnect")
    public ResponseEntity<String> disconnectSession(@PathVariable("sessionId") String sessionId)
           {

        String fireStaffLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        VideoCall videoCall = videoCallRepository.findByVideoCallSessionId(sessionId);
        if (fireStaffLoginId == null|| fireStaffLoginId.equals("anonymousUser")) {
            Caller caller = callerRepository.findByCallerSessionId(sessionId);
            VideoCallUser videoCallUser = videoCallUserRepository.
                    findByVideoCallUserCategoryAndVideoCallerIdAndVideoCallId("G",caller.getCallerId(),videoCall.getVideoCallId());
            videoCallUser.setVideoCallOutAt(LocalDateTime.now());
            videoCallUserRepository.save(videoCallUser);
        }else {
            FireStaff fireStaff = fireStaffRepository.findFireStaffByFireStaffLoginId(fireStaffLoginId);
            VideoCallUser videoCallUser = videoCallUserRepository.
                    findByVideoCallUserCategoryAndVideoCallerIdAndVideoCallId(String.valueOf(fireStaff.getFireStaffCategory()),fireStaff.getFireStaffId(),videoCall.getVideoCallId());
            videoCallUser.setVideoCallOutAt(LocalDateTime.now());
            videoCallUserRepository.save(videoCallUser);
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

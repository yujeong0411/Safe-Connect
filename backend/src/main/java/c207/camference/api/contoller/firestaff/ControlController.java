package c207.camference.api.contoller.firestaff;

import c207.camference.api.request.control.CallEndRequest;
import c207.camference.api.request.control.CallRoomRequest;
import c207.camference.api.request.control.CallUpdateRequest;
import c207.camference.api.request.control.ControlDispatchOrderRequest;
import c207.camference.api.request.control.ResendRequest;
import c207.camference.api.service.fireStaff.ControlService;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.webrtc.WebRtcService;
import c207.camference.temp.request.FireStaffCreateRequest;
import c207.camference.temp.request.MessageRequest;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/control")
public class ControlController {
    private final ControlService controlService;
    private final SmsService smsService;
    private final WebRtcService webRtcService;

    public ControlController(ControlService controlService, SmsService smsService, WebRtcService webRtcService) {
        this.controlService = controlService;
        this.smsService = smsService;
        this.webRtcService = webRtcService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody FireStaffCreateRequest request){
        return controlService.createUser(request);
    }


    @PostMapping("/message")
    public ResponseEntity<?> message(@RequestBody MessageRequest request){
        return smsService.controlSendMessage(request);
    }

    @GetMapping("/call")
    public ResponseEntity<?> call(){
        return controlService.getCalls();
    }

    @GetMapping("/call/detail")
    public ResponseEntity<?> callDetail(@RequestParam Integer callId){
        return controlService.getCall(callId);
    }

    //
    @GetMapping("/medi_list")
    public ResponseEntity<?> mediList(@RequestParam String callerPhone){
        return controlService.getUser(callerPhone);
    }

    @GetMapping("/dispatch_group")
    public ResponseEntity<?> getReadyDispatchGroups() {
        return controlService.getReadyDispatchGroups();
    }

    @PutMapping("/call")
    public ResponseEntity<?> updateCall(@RequestBody CallUpdateRequest request) {
        return controlService.updateCall(request);
    }

    // 영상통화방 URL 전송, 영상통화방 생성
    @PostMapping("/video")
    public ResponseEntity<?> createRoom(@RequestBody CallRoomRequest request) throws OpenViduJavaClientException, OpenViduHttpException {
        // sessionId 생성, URL 생성 및 메시지 전송
        String sessionId = webRtcService.makeSession(request.getCustomSessionId());
        String url = webRtcService.makeUrl(sessionId);

        System.out.println("sessionId: " + sessionId);
        System.out.println("url: " + url);
        return controlService.createRoom(request, url);
    }

    // 영상통화방 URL 재전송
    @PostMapping("/resend")
    public ResponseEntity<?> urlResend(@RequestBody ResendRequest request) {
        return controlService.resendUrl(request);
    }

    // 영상통화 종료시
    @PutMapping("/call_end")
    public ResponseEntity<?> callEnd(@RequestBody CallEndRequest request) {
        return controlService.callEnd(request);
    }

    @PostMapping("/dispatch_group_order")
    public ResponseEntity<?> dispatchOrder(@RequestBody ControlDispatchOrderRequest request) {
        return controlService.dispatchOrder(request);
    }
}

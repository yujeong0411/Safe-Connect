package c207.camference.api.contoller.firestaff;

import c207.camference.api.request.control.CallRoomRequest;
import c207.camference.api.request.control.CallUpdateRequest;
import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.service.fireStaff.ControlService;
import c207.camference.api.service.sms.SmsService;
import c207.camference.temp.request.FireStaffCreateRequest;
import c207.camference.temp.request.MessageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/control")
public class ControlController {
    private final ControlService controlService;
    private final SmsService smsService;

    public ControlController(ControlService controlService, SmsService smsService) {
        this.controlService = controlService;
        this.smsService = smsService;
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
    public ResponseEntity<?> createRoom(@RequestBody CallRoomRequest request) {
        return controlService.createRoom(request);
    }

    @PostMapping("/dispatch_group_order")
    public ResponseEntity<?> dispatchOrder(@RequestBody DispatchOrderRequest request) {
        return controlService.dispatchOrder(request);
    }
}

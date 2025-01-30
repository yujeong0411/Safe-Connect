package c207.camference.api.contoller.user;

import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.user.ControlService;
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
    @GetMapping("medi_list")
    public ResponseEntity<?> mediList(@RequestParam String patientPhone){
        return controlService.getUser(patientPhone);
    }

}

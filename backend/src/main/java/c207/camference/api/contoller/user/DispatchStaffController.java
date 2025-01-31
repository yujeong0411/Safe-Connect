package c207.camference.api.contoller.user;

import c207.camference.api.service.fireStaff.DispatchStaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dispatch_staff")
public class DispatchStaffController {
    DispatchStaffService dispatchStaffService;

    public DispatchStaffController(DispatchStaffService dispatchStaffService) {
        this.dispatchStaffService = dispatchStaffService;
    }

    @GetMapping("/report")
    public ResponseEntity<?> getReports(){
        return dispatchStaffService.getReports();
    }

//    @GetMapping("/call/detail")
//    public ResponseEntity<?> callDetail(@RequestParam Integer callId){
//        return dispatchStaffService.getCall(callId);
//    }

}

package c207.camference.api.contoller.firestaff;

import c207.camference.api.response.report.CallDto;
import c207.camference.api.service.fireStaff.ControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/control")
public class FireStaffController {

    private final ControlService controlService;

    @GetMapping("/dispatch_group")
    public ResponseEntity<?> getReadyDispatchGroups() {
        return controlService.getReadyDispatchGroups();
    }

    @PutMapping("/call")
    public ResponseEntity<?> updateCall(@RequestBody CallDto request) {
        return controlService.updateCall(request);
    }
}

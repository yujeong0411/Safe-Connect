package c207.camference.api.contoller.firestaff;

import c207.camference.api.request.control.CallRoomRequest;
import c207.camference.api.request.control.CallUpdateRequest;
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
    public ResponseEntity<?> updateCall(@RequestBody CallUpdateRequest request) {
        return controlService.updateCall(request);
    }

    // 영상통화방 URL 전송, 영상통화방 생성
    @PostMapping("/control/video")
    public ResponseEntity<?> createRoom(@RequestBody CallRoomRequest request) {
        // 영상통화방 테이블 생성

        // URL 전송

        // 신고자 생성


        return 
    }

}

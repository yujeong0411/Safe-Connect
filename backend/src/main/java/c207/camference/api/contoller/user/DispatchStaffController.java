package c207.camference.api.contoller.user;

import c207.camference.api.response.dispatchstaff.AvailableHospitalResponse;
import c207.camference.api.service.fireStaff.DispatchStaffService;
import c207.camference.util.response.ResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/emergency_room")
    // 신고자의 위치 정보(시도, 시군구)를 바탕으로 응급실 실시간 가용병상정보 조회
    public ResponseEntity<?> getAvailableEmergencyRooms(@RequestParam String siDo,
                                                        @RequestParam String siGunGu) {
        List<AvailableHospitalResponse> response = dispatchStaffService.getAvailableHospital(siDo, siGunGu);
        return ResponseEntity.ok().body(ResponseUtil.success(response, "가용 가능한 응급실 조회 성공"));
    }

    @GetMapping("/dispatch/detail")
    public ResponseEntity<?> dispatchDetail(@RequestParam int dispatchId){
        return dispatchStaffService.dispatchDetail(dispatchId);
    }

    @GetMapping("/transfer/detail")
    public ResponseEntity<?> transferDetail(@RequestParam int transferId){
        return dispatchStaffService.transferDetail(transferId);
    }

    @GetMapping("/emergency_rooms/request/detail")
    public ResponseEntity<?> emergencyRoomsRequestDetail(@RequestParam int dispatchId){
        return dispatchStaffService.getReqHospital(dispatchId);
    }

}

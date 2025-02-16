package c207.camference.api.contoller.firestaff;

import c207.camference.api.request.dispatchstaff.DispatchCurrentPositionRequest;
import c207.camference.api.request.dispatchstaff.DispatchRequest;
import c207.camference.api.request.dispatchstaff.PatientTransferRequest;
import c207.camference.api.request.dispatchstaff.PreKtasRequest;
import c207.camference.api.request.dispatchstaff.TransferUpdateRequest;
import c207.camference.api.request.patient.PatientCallRequest;
import c207.camference.api.request.patient.PatientInfoRequest;
import c207.camference.api.service.fireStaff.DispatchStaffService;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.sse.SseEmitterServiceImpl;
import c207.camference.util.response.ResponseUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/dispatch_staff")
public class DispatchStaffController {
    private final SmsService smsService;
    private final SseEmitterServiceImpl sseEmitterService;
    private final DispatchStaffService dispatchStaffService;

    public DispatchStaffController(DispatchStaffService dispatchStaffService, SmsService smsService, SseEmitterServiceImpl sseEmitterService) {
        this.dispatchStaffService = dispatchStaffService;
        this.smsService = smsService;
        this.sseEmitterService = sseEmitterService;
    }

    @GetMapping("/report")
    public ResponseEntity<?> getReports(){
        return dispatchStaffService.getReports();
    }

    @GetMapping("/report/detail")
    public ResponseEntity<?> getReportDetail(@RequestParam int dispatchId){
        return dispatchStaffService.getReportDetail(dispatchId);
    }

    @GetMapping("/emergency_room")
    // 신고자의 위치 정보(시도, 시군구)를 바탕으로 응급실 실시간 가용병상정보 조회
    public ResponseEntity<?> getAvailableEmergencyRooms(@RequestParam String siDo,
                                                        @RequestParam String siGunGu,
                                                        @RequestParam Double longitude,
                                                        @RequestParam Double latitude,
                                                        @RequestParam Double range) {
        return dispatchStaffService.getAvailableHospital(siDo, siGunGu, longitude, latitude, range);
    }

    @GetMapping("/dispatch/detail")
    public ResponseEntity<?> dispatchDetail(@RequestParam int dispatchId){
        return dispatchStaffService.dispatchDetail(dispatchId);
    }

    @GetMapping("/transfer/detail")
    public ResponseEntity<?> transferDetail(@RequestParam int transferId){
        return dispatchStaffService.transferDetail(transferId);
    }

    @PostMapping("/emergency_rooms/request")
    public ResponseEntity<?> transferRequest(@RequestBody PatientTransferRequest request) {
        return dispatchStaffService.transferRequest(request);
    }

    @GetMapping("/emergency_rooms/request/detail")
    public ResponseEntity<?> emergencyRoomsRequestDetail(@RequestParam int dispatchId){
        return dispatchStaffService.getReqHospital(dispatchId);
    }

    @PostMapping("/transfer/update")
    public ResponseEntity<?> transferUpdate(@RequestBody TransferUpdateRequest request) {
        return dispatchStaffService.transferUpdate(request);
    }

    @PutMapping("/patient_info")  // patient_info를 patient_inf로 변경
    public ResponseEntity<?> patientInfo(@RequestBody PatientInfoRequest request) {
        return dispatchStaffService.updatePatientInfo(request);
    }

    @PostMapping("/patient/call")
    public ResponseEntity<?> patientCall(@RequestBody PatientCallRequest request) {
        return smsService.dispatchSendMessage(request);
    }

    @PostMapping("/finish")
    public ResponseEntity<?> finishDispatch(@RequestBody DispatchRequest request) {
        return dispatchStaffService.finishDispatch(request);
    }

    @PutMapping("/depart_time")
    public ResponseEntity<?> dispatch(@RequestBody DispatchRequest request) {
        return dispatchStaffService.updateDepartTime(request);
    }

    @PutMapping("/arrive_time")
    public ResponseEntity<?> derpature(@RequestBody DispatchRequest request) {
        return dispatchStaffService.updateDispatchArriveAt(request);
    }

    @PostMapping("/current_pos")
    public ResponseEntity<?> dispatchCurrentPosition(@RequestBody DispatchCurrentPositionRequest request) {
        sseEmitterService.sendDispatchGroupPosition(request);
        return ResponseEntity.ok().body(ResponseUtil.success("구급차 현재 위치 공유 성공"));
    }

    @PostMapping("/patient/pre_ktas")
    public ResponseEntity<?> preKtas(
            @RequestBody PreKtasRequest request) throws IOException {
        return dispatchStaffService.getPreKtas(request);
    }
}

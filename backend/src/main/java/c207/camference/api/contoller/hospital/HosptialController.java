package c207.camference.api.contoller.hospital;

import c207.camference.api.request.hospital.TransferStatusRequest;
import c207.camference.api.service.hospital.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/hospital")
public class HosptialController {
    private final HospitalService hospitalService;

    public HosptialController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/transfer_accepted")
    public ResponseEntity<?> transferAccepted() {
        return hospitalService.getTransferAccepted();
    }

    @GetMapping("/transfer_accepted/detail")
    public ResponseEntity<?> transferAcceptedDetail(@RequestParam int transferId) {
        return hospitalService.getTransferAcceptedDetail(transferId);
    }

    @PostMapping("/transfer/status")
    public ResponseEntity<?> transferStatus(@RequestBody TransferStatusRequest request) {
        return hospitalService.respondToTransfer(request);
    }

    @GetMapping("/transfer_request")
    public ResponseEntity<?> transferRequest() {
        return hospitalService.transferRequest();
    }

    @GetMapping("/transfer_request/detail")
    public ResponseEntity<?> transferRequestDetail(@RequestParam int dispatchId) {
        return hospitalService.transferRequestDetail(dispatchId);
    }
}

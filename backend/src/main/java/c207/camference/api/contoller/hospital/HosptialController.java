package c207.camference.api.contoller.hospital;

import c207.camference.api.service.hospital.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


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


}

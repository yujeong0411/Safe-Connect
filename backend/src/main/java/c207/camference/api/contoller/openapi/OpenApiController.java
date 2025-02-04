package c207.camference.api.contoller.openapi;

import c207.camference.api.dto.openapi.FireDeptDto;
import c207.camference.api.dto.openapi.HospitalDto;
import c207.camference.api.service.openapi.OpenApiService;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OpenApiController {

    private final OpenApiService openApiService;

    @PostMapping("/save_fire_dept")
    public ResponseEntity<?> saveFireDept() {
        return openApiService.saveFireDept();
    }

    @PostMapping("save_hospital")
    public ResponseEntity<?> saveHospital() {
        return openApiService.saveHospital();
    }

    @PostMapping("save_aed")
    public ResponseEntity<?> saveAed() {
        return openApiService.saveAed();
    }

    @PostMapping("save_medication")
    public ResponseEntity<?> saveMedication() {
        return openApiService.saveMedication();
    }
}

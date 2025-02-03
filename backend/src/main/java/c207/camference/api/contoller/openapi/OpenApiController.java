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
        List<FireDeptDto> response = openApiService.saveFireDept();
        return ResponseEntity.ok().body(ResponseUtil.success(response, "소방서 저장 성공"));
    }

    @PostMapping("save_hospital")
    public ResponseEntity<?> saveHospital() {
        List<HospitalDto> response = openApiService.saveHospital();
        return ResponseEntity.ok().body(ResponseUtil.success(response, "병원 저장 성공"));
    }
}

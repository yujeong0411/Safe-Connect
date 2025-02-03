package c207.camference.api.service.openapi;

import c207.camference.api.dto.openapi.FireDeptDto;
import c207.camference.api.dto.openapi.HospitalDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OpenApiService {

    ResponseEntity<?> saveFireDept();
    ResponseEntity<?> saveHospital();
    ResponseEntity<?> saveAed();
    ResponseEntity<?> saveMedication();
}

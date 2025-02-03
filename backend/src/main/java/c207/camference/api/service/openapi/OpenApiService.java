package c207.camference.api.service.openapi;

import c207.camference.api.dto.openapi.FireDeptDto;
import c207.camference.api.dto.openapi.HospitalDto;

import java.util.List;

public interface OpenApiService {

    List<FireDeptDto> saveFireDept();
    List<HospitalDto> saveHospital();
}

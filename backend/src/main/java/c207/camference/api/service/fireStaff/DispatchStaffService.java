package c207.camference.api.service.fireStaff;

import c207.camference.api.response.dispatchstaff.AvailableHospitalResponse;
import c207.camference.db.entity.hospital.Hospital;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DispatchStaffService {
    ResponseEntity<?> getReports();
    ResponseEntity<?> getAvailableHospital(String siDo, String siGunGu);
    ResponseEntity<?> dispatchDetail(int DispatchId);
    ResponseEntity<?> transferDetail(int transferId);
    ResponseEntity<?> getReqHospital(int dispatchId);
}

package c207.camference.api.service.fireStaff;

import c207.camference.api.request.dispatchstaff.TransferUpdateRequest;
import org.springframework.http.ResponseEntity;

public interface DispatchStaffService {
    ResponseEntity<?> getReports();
    ResponseEntity<?> getAvailableHospital(String siDo, String siGunGu);
    ResponseEntity<?> dispatchDetail(int DispatchId);
    ResponseEntity<?> transferDetail(int transferId);
    ResponseEntity<?> getReqHospital(int dispatchId);

    ResponseEntity<?> transferUpdate(TransferUpdateRequest request);
}

package c207.camference.api.service.fireStaff;

import c207.camference.api.request.dispatchstaff.DispatchRequest;
import c207.camference.api.request.dispatchstaff.PatientTransferRequest;
import c207.camference.api.request.dispatchstaff.PreKtasRequest;
import c207.camference.api.request.dispatchstaff.TransferUpdateRequest;
import c207.camference.api.request.patient.PatientInfoRequest;
import org.springframework.http.ResponseEntity;

public interface DispatchStaffService {
    ResponseEntity<?> getReports();
    ResponseEntity<?> getAvailableHospital(String siDo, String siGunGu);
    ResponseEntity<?> dispatchDetail(int DispatchId);
    ResponseEntity<?> transferDetail(int transferId);
    ResponseEntity<?> getReqHospital(int dispatchId);
    ResponseEntity<?> transferRequest(PatientTransferRequest request);
    ResponseEntity<?> transferUpdate(TransferUpdateRequest request);
    ResponseEntity<?> updatePatientInfo(PatientInfoRequest request);

    ResponseEntity<?> updateDepartTime(DispatchRequest request);
    ResponseEntity<?> updateDispatchArriveAt(DispatchRequest request);
    ResponseEntity<?> finishDispatch(DispatchRequest request);


    ResponseEntity<?> getPreKtas(PreKtasRequest request);
}

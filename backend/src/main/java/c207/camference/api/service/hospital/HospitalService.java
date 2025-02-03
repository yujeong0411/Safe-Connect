package c207.camference.api.service.hospital;


import org.springframework.http.ResponseEntity;

public interface HospitalService {
    ResponseEntity<?> getTransferAccepted();
    ResponseEntity<?> getTransferAcceptedDetail(int transferId);
}

package c207.camference.api.service.hospital;


import c207.camference.api.request.hospital.TransferStatusRequest;
import org.springframework.http.ResponseEntity;

public interface HospitalService {
    ResponseEntity<?> getTransferAccepted();
    ResponseEntity<?> getTransferAcceptedDetail(int transferId);
    ResponseEntity<?> respondToTransfer(TransferStatusRequest request);
    ResponseEntity<?> transferRequest();
    ResponseEntity<?> transferRequestDetail(int dispatchId);
}

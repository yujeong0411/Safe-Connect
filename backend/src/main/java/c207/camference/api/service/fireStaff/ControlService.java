package c207.camference.api.service.fireStaff;

import c207.camference.api.response.report.CallResponse;
import c207.camference.temp.request.FireStaffCreateRequest;
import org.springframework.http.ResponseEntity;

public interface ControlService {
    ResponseEntity<?> createUser(FireStaffCreateRequest request);
    ResponseEntity<?> getCalls();
    ResponseEntity<?> getCall(Integer callId);
    ResponseEntity<?> getUser(String callerPhone);

    ResponseEntity<?> getReadyDispatchGroups();
    ResponseEntity<?> updateCall(CallResponse request);
}

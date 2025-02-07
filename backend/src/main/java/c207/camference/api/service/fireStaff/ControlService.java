package c207.camference.api.service.fireStaff;

import c207.camference.api.request.control.CallEndRequest;
import c207.camference.api.request.control.CallRoomRequest;
import c207.camference.api.request.control.CallUpdateRequest;
import c207.camference.api.request.control.ResendRequest;
import c207.camference.temp.request.FireStaffCreateRequest;
import org.springframework.http.ResponseEntity;

public interface ControlService {
    ResponseEntity<?> createUser(FireStaffCreateRequest request);
    ResponseEntity<?> getCalls();
    ResponseEntity<?> getCall(Integer callId);
    ResponseEntity<?> getUser(String callerPhone);

    ResponseEntity<?> getReadyDispatchGroups();

    ResponseEntity<?> updateCall(CallUpdateRequest request);

    ResponseEntity<?> createRoom(CallRoomRequest request);
    ResponseEntity<?> callEnd(CallEndRequest request);

    ResponseEntity<?> resendUrl(ResendRequest request);
}

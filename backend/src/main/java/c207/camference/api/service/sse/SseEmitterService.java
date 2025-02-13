package c207.camference.api.service.sse;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.request.dispatchstaff.DispatchCurrentPositionRequest;
import c207.camference.api.request.user.ShareLocationRequest;
import c207.camference.api.response.dispatchstaff.DispatchGroupPatientTransferResponse;
import c207.camference.api.response.hospital.AcceptedHospitalResponse;
import c207.camference.api.response.hospital.HospitalPatientTransferResponse;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseEmitterService {

    SseEmitter createControlEmitter(String clientId);
    SseEmitter createDispatchGroupEmitter(String clientId);
    SseEmitter createHospitalEmitter(Integer clientId);
    SseEmitter createCallerEmitter(Integer clientId);

    void sendDispatchOrder(DispatchOrderRequest data);
    void transferRequest(DispatchGroupPatientTransferResponse dispatchGroupData, HospitalPatientTransferResponse hospitalData);
    void hospitalResponse(AcceptedHospitalResponse response, boolean accepted);
    void sendDispatchGroupPosition(DispatchCurrentPositionRequest request);
    void shareCallerLocation(ShareLocationRequest request);
}

package c207.camference.api.service.sse;

import c207.camference.api.request.control.ControlDispatchOrderRequest;
import c207.camference.api.request.dispatchstaff.DispatchCurrentPositionRequest;
import c207.camference.api.request.user.ShareLocationRequest;
import c207.camference.api.response.dispatchstaff.ControlDispatchOrderResponse;
import c207.camference.api.response.dispatchstaff.DispatchGroupPatientTransferResponse;
import c207.camference.api.response.hospital.AcceptedHospitalResponse;
import c207.camference.api.response.hospital.HospitalPatientTransferResponse;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseEmitterService {

    SseEmitter createControlEmitter(String clientId);
    SseEmitter createDispatchGroupEmitter(String clientId);
//    SseEmitter createHospitalEmitter(Integer clientId);
    SseEmitter createHospitalEmitter(String clientId);
    SseEmitter createCallerEmitter(String clientId);

    void sendDispatchOrder(ControlDispatchOrderRequest controlData, ControlDispatchOrderResponse dispatchGroupData);
    void transferRequest(DispatchGroupPatientTransferResponse dispatchGroupData, HospitalPatientTransferResponse hospitalData);
    void hospitalResponse(AcceptedHospitalResponse response, boolean accepted,Integer dispatchId);
    void sendDispatchGroupPosition(DispatchCurrentPositionRequest request);
    void shareCallerLocation(ShareLocationRequest request);
}

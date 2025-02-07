package c207.camference.api.service.fireStaff;

import c207.camference.api.request.control.DispatchOrderRequest;
import org.springframework.http.ResponseEntity;

public interface ControlOrderService {

    public ResponseEntity<?> dispatchOrder(DispatchOrderRequest request);
}

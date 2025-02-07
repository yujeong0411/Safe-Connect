package c207.camference.api.contoller;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.service.fireStaff.ControlOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequiredArgsConstructor
@RequestMapping("/control")
public class EmergencyWebSocketController {

    private final ControlOrderService controlOrderService;

    @PostMapping("/dispatch_group_order")
    public ResponseEntity<?> handleDispatchCommand(@RequestBody DispatchOrderRequest request) {
        return controlOrderService.dispatchOrder(request);
    }
}
package c207.camference.api.request.control;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ControlDispatchOrderRequest {
    private Integer dispatchGroupId;
    private Integer callId;
    private Integer patientId;
    private String sessionId;
}

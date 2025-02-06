package c207.camference.api.request.control;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DispatchOrderRequest {
    private Integer dispatchGroupId;
    private Integer callId;
}

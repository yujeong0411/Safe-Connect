package c207.camference.api.request.dispatchstaff;

import lombok.Getter;

@Getter
public class DispatchCurrentPositionRequest {
    private String sessionId;
    private Double lat;
    private Double lng;
}

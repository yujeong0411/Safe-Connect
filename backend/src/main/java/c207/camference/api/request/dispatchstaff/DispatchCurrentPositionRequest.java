package c207.camference.api.request.dispatchstaff;

import lombok.Getter;

@Getter
public class DispatchCurrentPositionRequest {
    private Integer callId;
    private Integer dispatchGroupId;
    private Double dispatchGroupLatitude;
    private Double dispatchGroupLongitude;
}

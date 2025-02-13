package c207.camference.api.request.user;

import lombok.Getter;

@Getter
public class ShareLocationRequest {
    private double lat;
    private double lng;
    private String sessionId;

}

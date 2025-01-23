package c207.camference.api.request.user;

import lombok.Data;

@Data
public class UserValidPhoneCheckRequest {
    private String userPhone;
    private String authCode;
}

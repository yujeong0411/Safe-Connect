package c207.camference.api.request.user;

import lombok.Data;

@Data
public class UserPasswordChangeRequest {
    private String newPassword;
}

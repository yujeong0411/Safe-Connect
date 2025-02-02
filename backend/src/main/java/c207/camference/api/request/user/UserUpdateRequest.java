package c207.camference.api.request.user;


import lombok.Data;

@Data
public class UserUpdateRequest {
    private String userName;
    private String userBirthday;
    private Character userGender;
    private String userPhone;
    private String userProtectorPhone;
}

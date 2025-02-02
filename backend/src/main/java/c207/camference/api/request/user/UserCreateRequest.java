package c207.camference.api.request.user;


import lombok.Data;

@Data
public class UserCreateRequest {
    private String userEmail;
    private String userPassword;
    private String userName;
    private String userBirthday;
    private Character userGender;
    private String userPhone;
    private String userProtectorPhone;
}

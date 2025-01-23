package c207.camference.api.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor //
@Builder
public class UserResponse {

    private Integer userId;
    private String userEmail;
    private String userName;
    private String userBirthday;
    private Character userGender;
    private String userPhone;
    private String userProtectorPhone;
    private Boolean userWithdraw;
    private LocalDateTime userCreatedAt;
    private LocalDateTime userUpdatedAt;

}

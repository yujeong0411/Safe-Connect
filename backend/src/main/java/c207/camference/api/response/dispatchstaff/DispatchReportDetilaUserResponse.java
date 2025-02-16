package c207.camference.api.response.dispatchstaff;

import c207.camference.db.entity.users.User;
import lombok.Getter;

@Getter
public class DispatchReportDetilaUserResponse {
    private String userPhone;
    private String protectorPhone;

    public DispatchReportDetilaUserResponse(User user) {
        this.userPhone = user.getUserPhone();
        this.protectorPhone = user.getUserProtectorPhone();
    }
}

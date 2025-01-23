package c207.camference.api.service.sms;

import c207.camference.api.request.user.UserValidPhoneCheckRequest;

public interface SmsService {
    void userPhoneValid(String userPhone);
    Boolean userPhoneValidCheck(UserValidPhoneCheckRequest request);
}

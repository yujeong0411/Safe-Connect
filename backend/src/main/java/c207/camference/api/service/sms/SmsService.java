package c207.camference.api.service.sms;

import c207.camference.api.request.user.UserValidPhoneCheckRequest;
import org.springframework.http.ResponseEntity;

public interface SmsService {
    ResponseEntity<?> userPhoneValid(String userPhone);
    ResponseEntity<?> userPhoneValidCheck(UserValidPhoneCheckRequest request);
}

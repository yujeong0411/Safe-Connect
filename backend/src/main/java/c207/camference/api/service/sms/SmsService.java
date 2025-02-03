package c207.camference.api.service.sms;

import c207.camference.api.request.user.UserValidPhoneCheckRequest;
import c207.camference.temp.request.MessageRequest;
import org.springframework.http.ResponseEntity;

public interface SmsService {
    ResponseEntity<?> userPhoneValid(String userPhone);
    ResponseEntity<?> userPhoneValidCheck(UserValidPhoneCheckRequest request);
    ResponseEntity<?> controlSendMessage(MessageRequest request);
}

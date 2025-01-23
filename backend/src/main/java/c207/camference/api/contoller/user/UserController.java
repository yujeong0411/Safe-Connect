package c207.camference.api.contoller.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.request.user.UserValidPhoneCheckRequest;
import c207.camference.api.request.user.UserValidPhoneRequest;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.user.UserService;
import c207.camference.util.redis.RedisUtil;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;
    private final SmsService smsService;
    private final RedisUtil redisUtil;

    public UserController(
            UserService userService,
            SmsService smsService,
            RedisUtil redisUtil) {

        this.userService = userService;
        this.smsService = smsService;
        this.redisUtil = redisUtil;
    }

//    // 토큰 검증 및 role 접근권한 제대로 사용되는가 확인용
//    @GetMapping("/")
//    public ResponseEntity<?> getMainPage() {
//        return ResponseEntity.status(HttpStatus.OK).body(SecurityContextHolder.getContext().getAuthentication().getName());
//    }

    @PostMapping("/user/signup")
    public ResponseEntity<?> signup(@RequestBody UserCreateRequest request){
        userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("회원 가입이 완료되었습니다.");
    }
    @GetMapping("/user/valid/email")
    public ResponseEntity<?> validEmail(@RequestParam String userEmail){

        EmailValidator validator = EmailValidator.getInstance();
        //이메일 형식 확인
        if(!validator.isValid(userEmail)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("메일 형식이 다릅니다.");
        }
        //이메일 중복여부 확인
        if (userService.validEmail(userEmail)){
            return ResponseEntity.status(HttpStatus.OK).body("가입 가능한 메일입니다.");
        }else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 있는 이메일입니다..");
        }
    }

    @PostMapping("/user/valid/phone")
    public ResponseEntity<?> validPhone(@RequestBody UserValidPhoneRequest request) {

        String userPhone = request.getUserPhone().replace("-", "");
        smsService.userPhoneValid(userPhone);

        return ResponseEntity.status(HttpStatus.OK).body("전화번호 처리 후 : "+userPhone);

    }

    @PostMapping("/user/valid/phone/check")
    public ResponseEntity<?> certificateSms(@RequestBody UserValidPhoneCheckRequest request){

        if(smsService.userPhoneValidCheck(request)){
            return ResponseEntity.status(200).body("전화번호 인증 성공");
        }else{
            return ResponseEntity.status(400).body("전화번호 인증 실패");
        }
    }
}


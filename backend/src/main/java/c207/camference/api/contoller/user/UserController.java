package c207.camference.api.contoller.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.request.user.UserUpdateRequest;
import c207.camference.api.request.user.UserValidPhoneCheckRequest;
import c207.camference.api.request.user.UserValidPhoneRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.user.UserResponse;
import c207.camference.db.entity.User;
import c207.camference.db.repository.UserRepository;
import c207.camference.util.response.ResponseUtil;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.user.UserService;
import c207.camference.util.redis.RedisUtil;
import org.apache.commons.validator.routines.EmailValidator;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;
    private final SmsService smsService;
    private final RedisUtil redisUtil;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public UserController(
            UserService userService,
            SmsService smsService,
            RedisUtil redisUtil,
            ModelMapper modelMapper,
            UserRepository userRepository) {

        this.userService = userService;
        this.smsService = smsService;
        this.redisUtil = redisUtil;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }


    @PostMapping("/user/signup")
    public ResponseEntity<?> signup(@RequestBody UserCreateRequest request){
        return userService.createUser(request);

    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(){
        return userService.getUserByEmail();
    }


    @PutMapping("/user")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest request){
        return userService.updateUser(request);
    }

    @GetMapping("/user/valid/email")
    public ResponseEntity<?> validEmail(@RequestParam String userEmail){
        //이메일 중복여부 확인
        return userService.validEmail(userEmail);
    }

    @PostMapping("/user/valid/phone")
    public ResponseEntity<?> validPhone(@RequestBody UserValidPhoneRequest request) {
        String userPhone = request.getUserPhone().replace("-", "");
        return smsService.userPhoneValid(userPhone);
    }

    @PostMapping("/user/valid/phone/check")
    public ResponseEntity<?> certificateSms(@RequestBody UserValidPhoneCheckRequest request){
        return smsService.userPhoneValidCheck(request);
    }

}


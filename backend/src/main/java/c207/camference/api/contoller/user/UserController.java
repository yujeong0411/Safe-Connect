package c207.camference.api.contoller.user;

import c207.camference.api.request.user.*;
import c207.camference.api.service.sms.SmsService;
import c207.camference.api.service.user.UserService;
import c207.camference.db.repository.UserRepository;
import c207.camference.util.redis.RedisUtil;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
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


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserCreateRequest request){
        return userService.createUser(request);

    }

    @GetMapping("")
    public ResponseEntity<?> getUser(){
        return userService.getUser();
    }


    @PutMapping("")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest request){
        return userService.updateUser(request);
    }

    @DeleteMapping("")
    public ResponseEntity<?> deleteUser(){return userService.deleteUser();}



    @GetMapping("/valid/email")
    public ResponseEntity<?> validEmail(@RequestParam String userEmail){
        //이메일 중복여부 확인
        return userService.validEmail(userEmail);
    }

    @PostMapping("/valid/phone")
    public ResponseEntity<?> validPhone(@RequestBody UserValidPhoneRequest request) {
        String userPhone = request.getUserPhone().replace("-", "");
        return smsService.userPhoneValid(userPhone);
    }

    @PostMapping("/valid/phone/check")
    public ResponseEntity<?> certificateSms(@RequestBody UserValidPhoneCheckRequest request){
        return smsService.userPhoneValidCheck(request);
    }


<<<<<<< HEAD
=======

>>>>>>> 9494a876eee1f3528c5ef7a68f5a37c7b2574c62
    @GetMapping("/find/email")
    public ResponseEntity<?> findEmail( @RequestParam String userName, @RequestParam String userPhone){
        return userService.findEmail(userName,userPhone);
    }

    @PutMapping("/find/password")
    public ResponseEntity<?> findPassword(@RequestBody UserFindPasswordRequest request){
        return userService.findPassword(request.getUserEmail());
    }

    @PutMapping("/password/change")
    public ResponseEntity<?> changePassword(@RequestBody UserPasswordChangeRequest request) {
        return userService.changePassword(request);
    }

}


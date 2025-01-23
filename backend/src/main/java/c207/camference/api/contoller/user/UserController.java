package c207.camference.api.contoller.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.service.user.UserService;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

}

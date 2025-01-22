package c207.camference.api.contoller.user;

import c207.camference.api.request.user.UserCreateRequest;
import c207.camference.api.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    // 토큰 검증 로직 확인용
    @GetMapping("/")
    public ResponseEntity<?> getMainPage() {
        return ResponseEntity.status(HttpStatus.OK).body(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @PostMapping("/user/signup")
    public ResponseEntity<?> signup(@RequestBody UserCreateRequest request){
        userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("회원 가입이 완료되었습니다.");
    }

}

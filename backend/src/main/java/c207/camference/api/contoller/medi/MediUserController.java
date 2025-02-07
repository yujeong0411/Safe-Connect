package c207.camference.api.contoller.medi;

import c207.camference.api.request.medi.MediIdsRequest;
import c207.camference.api.service.user.UserMediService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/medi")
public class MediUserController {

    private final UserMediService userMediService;

    // 회원 약물, 질환 조회
    @GetMapping
    public ResponseEntity<?> getUserMediInfo(@RequestHeader("Authorization") String token) {
        return userMediService.getUserMediInfo(token);
    }

    // 회원 약물, 질환 저장
    @PostMapping
    public ResponseEntity<?> saveMediInfo(@RequestHeader("Authorization") String token,
                                          @RequestBody MediIdsRequest mediIds) {

        return userMediService.saveMediInfo(token, mediIds.getMediIds());
    }

    // 회원 약물, 질환 수정
    @PutMapping
    public ResponseEntity<?> updateMediInfo(@RequestHeader("Authorization") String token,
                                            @RequestBody MediIdsRequest mediIds) {

        return userMediService.updateMediInfo(token, mediIds.getMediIds());
    }

    @GetMapping("/list")
    public ResponseEntity<?> getMediList() {
        return userMediService.getMediList();
    }
}

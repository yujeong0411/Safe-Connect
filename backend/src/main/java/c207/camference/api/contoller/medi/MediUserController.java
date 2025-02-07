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
    public ResponseEntity<?> getUserMediInfo() {
        return userMediService.getUserMediInfo();
    }

    // 회원 약물, 질환 저장
    @PostMapping
    public ResponseEntity<?> saveMediInfo(@RequestBody MediIdsRequest mediIds) {

        return userMediService.saveMediInfo(mediIds.getMediIds());
    }

    // 회원 약물, 질환 수정
    @PutMapping
    public ResponseEntity<?> updateMediInfo(@RequestBody MediIdsRequest mediIds) {

        return userMediService.updateMediInfo(mediIds.getMediIds());
    }

    @GetMapping("/list")
    public ResponseEntity<?> getMediList() {
        return userMediService.getMediList();
    }
}

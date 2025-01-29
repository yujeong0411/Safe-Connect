package c207.camference.api.contoller.medi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.api.dto.user.CustomUserDetails;
import c207.camference.api.request.medi.MediIdsRequest;
import c207.camference.api.service.medi.MediService;
import c207.camference.api.service.medi.UserMediService;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/medi")
public class MediUserController {

    private final UserMediService userMediService;
    private final MediService mediService;

    // 회원 약물, 질환 저장
    @PostMapping
    public ResponseEntity<?> addMedi(@AuthenticationPrincipal CustomUserDetails userDetails,
                                     @RequestBody MediIdsRequest mediIds) {

        try {
            List<MediCategoryDto> saveMedis = userMediService.saveMediInfo(userDetails.getUserEmail(), mediIds.getMediIds());
            return ResponseEntity.ok()
                    .body(ResponseUtil.success(saveMedis, "회원의 복용약물, 기저질환 저장 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.fail(500, "서버 오류"));
        }
    }

    // 회원 약물, 질환 조회
    @GetMapping
    public ResponseEntity<?> getUserMediList(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            List<MediCategoryDto> userMediList = userMediService.getUserMediList(userDetails.getUserEmail());
            return ResponseEntity.ok()
                    .body(ResponseUtil.success(userMediList, "회원의 복용약물, 기저질환 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.fail(500, "서버 오류"));
        }
    }
}

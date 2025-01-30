package c207.camference.api.contoller.medi;

import c207.camference.api.dto.medi.MediCategoryDto;
import c207.camference.api.dto.medi.MediDto;
import c207.camference.api.dto.user.CustomUserDetails;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.service.medi.MediService;
import c207.camference.api.service.medi.UserMediService;
import c207.camference.db.entity.User;
import c207.camference.db.entity.UserMediDetail;
import c207.camference.db.repository.UserMediDetailRepository;
import c207.camference.db.repository.UserRepository;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/medi")
public class MediController {

    private final MediService mediService;
    private final UserRepository userRepository;
    private final UserMediService userMediService;

    @GetMapping("/list")
    public ResponseEntity<?> getMediList() {

        try {
            List<MediCategoryDto> response = mediService.getMediList();
            return ResponseEntity.ok()
                    .body(ResponseUtil.success(response, "약물, 기저질환 전체 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseUtil.fail(500, "서버 오류"));
        }
    }


}

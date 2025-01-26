package c207.camference.api.contoller.medi;

import c207.camference.api.dto.medi.MediDto;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.medi.MediListResponse;
import c207.camference.api.service.medi.MediService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user/medi")
public class MediController {

    private final MediService mediService;

    @Autowired
    public MediController(MediService mediService) {
        this.mediService = mediService;
    }

    @GetMapping("/list")
    public ResponseData<MediListResponse> getMediList(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        List<MediDto> medications = mediService.getMedications();
        List<MediDto> diseases = mediService.getDiseases();

        MediListResponse response = new MediListResponse(medications, diseases);
        return new ResponseData<>(
                true,
                200,
                "약물, 기저질환 전체 조회 성공",
                response
        );
    }
}

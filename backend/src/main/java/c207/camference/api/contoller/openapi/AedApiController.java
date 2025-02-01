package c207.camference.api.contoller.openapi;

import c207.camference.api.service.openapi.AedService;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AedApiController {

    private final AedService aedService;

    @GetMapping("/save_aed")
    public ResponseEntity<?> saveAed() {
        aedService.saveAed();
        return ResponseEntity.ok().body(ResponseUtil.success("Aed 위치 저장 성공"));
    }
}
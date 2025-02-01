package c207.camference.api.contoller.openapi;

import c207.camference.api.response.openapi.AedResponse;
import c207.camference.api.service.openapi.AedService;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("nearby_aed")
    public ResponseEntity<?> getNearbyAed(@RequestParam double lat,
                                          @RequestParam double lon) {
        List<AedResponse> response = aedService.getAedsNearBy(lat, lon);
        return ResponseEntity.ok(ResponseUtil.success(response, "신고자 근처 AED 위치 공유 성공"));
    }
}
package c207.camference.api.contoller.sse;

import c207.camference.api.service.sse.SseEmitterService;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.repository.hospital.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class SseController {
    private final SseEmitterService sseEmitterService;
    private final HospitalRepository hospitalRepository;

    @GetMapping(value = "/control/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeControl(@RequestParam String clientId) {  // Integer -> String
        return sseEmitterService.createControlEmitter(clientId);
    }

    @GetMapping(value = "/control/order/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeControlOrder(@RequestParam String clientId) {  // Integer -> String
        return sseEmitterService.createControlEmitter(clientId);
    }


    @GetMapping(value = "/dispatchGroup/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeDispatchGroup(@RequestParam String clientId) {  // Integer -> String
        return sseEmitterService.createDispatchGroupEmitter(clientId);
    }

    @GetMapping(value = "/dispatchGroup/transfer/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeDispatchGroupTransfer(@RequestParam String clientId) {  // Integer -> String
        return sseEmitterService.createDispatchGroupEmitter(clientId);
    }

/*
    @GetMapping(value = "/hospital/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeHospital() {
        String hospitalLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        Hospital hospital = hospitalRepository.findByHospitalLoginId(hospitalLoginId)
                .orElse(null);
        Integer hospitalId = hospital.getHospitalId();
        return sseEmitterService.createHospitalEmitter(hospitalId);
    }
*/

    @GetMapping(value = "/hospital/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeHospital(@RequestParam String clientId) {
        return sseEmitterService.createHospitalEmitter(clientId);
    }

    @GetMapping(value = "/caller/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    // clientId는 세션아이디
    public SseEmitter subscribeCaller(@RequestParam String clientId) {
        return sseEmitterService.createCallerEmitter(clientId);
    }
}
package c207.camference.api.contoller.sse;

import c207.camference.api.service.sse.SseEmitterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class SseController {
    private final SseEmitterService sseEmitterService;

    @GetMapping(value = "/control/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeControl(@RequestParam Integer clientId) {
        return sseEmitterService.createControlEmitter(clientId);
    }

    @GetMapping(value = "/dispatchGroup/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeDispatchGroup(@RequestParam Integer clientId) {
        return sseEmitterService.createDispatchGroupEmitter(clientId);
    }

    @GetMapping(value = "/hospital/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeHospital(@RequestParam Integer clientId) {
        return sseEmitterService.createHospitalEmitter(clientId);
    }

    @GetMapping(value = "/caller/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeCaller(@RequestParam Integer clientId) {
        return sseEmitterService.createCallerEmitter(clientId);
    }
}
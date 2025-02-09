package c207.camference.api.service.sse;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.request.dispatchstaff.PatientTransferRequest;
import c207.camference.api.response.hospital.PatientTransferResponse;
import c207.camference.util.response.ResponseUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseEmitterService {
    private final Map<String, SseEmitter> controlEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> dispatchGroupEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> hospitalEmitters = new ConcurrentHashMap<>();


    public SseEmitter createControlEmitter(String clientId) {
        return createEmitter(clientId, controlEmitters);
    }

    public SseEmitter createDispatchGroupEmitter(String clientId) {
        return createEmitter(clientId, dispatchGroupEmitters);
    }

    public SseEmitter createHospitalEmitter(String clientId) {
        return createEmitter(clientId, hospitalEmitters);
    }


    // 상황실-구급팀 출동 지령
    public void sendDispatchOrder(DispatchOrderRequest data) {
        // 상황실에 응답 전송
        List<String> deadControlEmitters = new ArrayList<>();
        controlEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(data, "출동 지령 전송 성공")));
            } catch (IOException e) {
                deadControlEmitters.add(clientId);
            }
        });
        // 오류로 연결이 끊어진 clientId는 controlEmitters에서 제거
        deadControlEmitters.forEach(controlEmitters::remove);

        // 구급팀에 응답 전송
        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(data, "출동 지령 수신")));
            } catch (IOException e) {
                deadDispatchGroupEmitters.add(clientId);
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }

    // 병원-구급팀 환자 이송 요청
    public void transferRequest(PatientTransferRequest dispatchGroupData, PatientTransferResponse hospitalData) {
        // 병원에 응답 전송
        List<String> daedHospitalEmitters = new ArrayList<>();
        hospitalEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(hospitalData, "환자 이송 요청이 접수되었습니다.")));
            } catch (IOException e) {
                daedHospitalEmitters.add(clientId);
            }
        });
        daedHospitalEmitters.forEach(hospitalEmitters::remove);

        // 구급팀에 응답 전송
        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(dispatchGroupData, "환자 이송 요청이 승인되었습니다")));
            } catch (IOException e) {
                deadDispatchGroupEmitters.add(clientId);
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }




    private SseEmitter createEmitter(String clientId, Map<String, SseEmitter> emitters) {
        SseEmitter emitter = new SseEmitter(60000L);
        emitters.put(clientId, emitter);

        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));

        return emitter;
    }

}

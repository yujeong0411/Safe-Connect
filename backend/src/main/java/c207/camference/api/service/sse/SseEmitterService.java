package c207.camference.api.service.sse;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.request.dispatchstaff.DispatchCurrentPositionRequest;
import c207.camference.api.request.dispatchstaff.PatientTransferRequest;
import c207.camference.api.response.hospital.AcceptedHospitalResponse;
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
    private final Map<Integer, SseEmitter> controlEmitters = new ConcurrentHashMap<>();
    private final Map<Integer, SseEmitter> dispatchGroupEmitters = new ConcurrentHashMap<>();
    private final Map<Integer, SseEmitter> hospitalEmitters = new ConcurrentHashMap<>();
    private final Map<Integer, SseEmitter> callerEmitters = new ConcurrentHashMap<>();


    public SseEmitter createControlEmitter(Integer clientId) {
        return createEmitter(clientId, controlEmitters);
    }

    public SseEmitter createDispatchGroupEmitter(Integer clientId) {
        return createEmitter(clientId, dispatchGroupEmitters);
    }

    public SseEmitter createHospitalEmitter(Integer clientId) {
        return createEmitter(clientId, hospitalEmitters);
    }

    public SseEmitter createCallerEmitter(Integer clientId) {
        SseEmitter emitter = createEmitter(clientId, callerEmitters);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected!"));
        } catch (IOException e) {
            callerEmitters.remove(clientId);
        }
        return emitter;
//        return createEmitter(clientId, callerEmitters);
    }


    // 상황실-구급팀 출동 지령
    public void sendDispatchOrder(DispatchOrderRequest data) {
        // 상황실에 응답 전송
        List<Integer> deadControlEmitters = new ArrayList<>();
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
        List<Integer> deadDispatchGroupEmitters = new ArrayList<>();
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
        List<Integer> daedHospitalEmitters = new ArrayList<>();
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
        List<Integer> deadDispatchGroupEmitters = new ArrayList<>();
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

    // 환자 이송요청 수락/거절 알림
    public void hospitalResponse(AcceptedHospitalResponse response, boolean accepted) {
        String answer = accepted ? "환자 이송 요청 승인" : "환자 이송 요청 거절";

        // to 구급팀
        List<Integer> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name("transfer response")
                        .data(ResponseUtil.success(response, answer)));
                System.out.println("SSE event sent to: " + clientId); // 디버깅
            } catch (IOException e) {
                deadDispatchGroupEmitters.add(clientId);
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }

    // 구급차 현재 위치 전송
    public void sendDispatchGroupPosition(DispatchCurrentPositionRequest request) {
        Integer callId = request.getCallId();
        // 신고자는 해당 신고 id를 구독
        SseEmitter emitter = callerEmitters.get(callId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("location update")
                        .data(ResponseUtil.success(request, "구급차 현재 위치 공유 성공")));
            } catch (IOException e) {
                callerEmitters.remove(callId);
                System.out.println("Error sending update: " + e.getMessage());
            }
        }
    }



    private SseEmitter createEmitter(Integer clientId, Map<Integer, SseEmitter> emitters) {
        SseEmitter emitter = new SseEmitter(60000L);
        emitters.put(clientId, emitter);

        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));

        return emitter;
    }
}

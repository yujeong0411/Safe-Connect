package c207.camference.api.service.sse;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.request.dispatchstaff.DispatchCurrentPositionRequest;
import c207.camference.api.request.user.ShareLocationRequest;
import c207.camference.api.response.dispatchstaff.DispatchGroupPatientTransferResponse;
import c207.camference.api.response.hospital.AcceptedHospitalResponse;
import c207.camference.api.response.hospital.HospitalPatientTransferResponse;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.util.response.ResponseUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseEmitterServiceImpl implements SseEmitterService {
//    private final Map<Integer, SseEmitter> controlEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> controlEmitters = new ConcurrentHashMap<>();
//    private final Map<Integer, SseEmitter> dispatchGroupEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> dispatchGroupEmitters = new ConcurrentHashMap<>();
    private final Map<Integer, SseEmitter> hospitalEmitters = new ConcurrentHashMap<>();
    private final Map<Integer, SseEmitter> callerEmitters = new ConcurrentHashMap<>();
    private final HospitalRepository hospitalRepository;

    public SseEmitterServiceImpl(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }


/*
    public SseEmitter createControlEmitter(Integer clientId) {
        return createEmitter(clientId, controlEmitters);
    }
*/

    @Override
    public SseEmitter createControlEmitter(String clientId) {
        SseEmitter emitter = new SseEmitter(60000L);
        controlEmitters.put(clientId, emitter);

        emitter.onCompletion(() -> controlEmitters.remove(clientId));
        emitter.onTimeout(() -> controlEmitters.remove(clientId));

        return emitter;
    }

/*
    public SseEmitter createDispatchGroupEmitter(Integer clientId) {
        return createEmitter(clientId, dispatchGroupEmitters);
    }
*/

    @Override
    public SseEmitter createDispatchGroupEmitter(String clientId) {
        SseEmitter emitter = new SseEmitter(60000L);
        dispatchGroupEmitters.put(clientId, emitter);

        emitter.onCompletion(() -> dispatchGroupEmitters.remove(clientId));
        emitter.onTimeout(() -> dispatchGroupEmitters.remove(clientId));

        return emitter;
    }

    @Override
    public SseEmitter createHospitalEmitter(Integer clientId) {
        return createEmitter(clientId, hospitalEmitters);
    }

    @Override
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


    @Override
    // 상황실-구급팀 출동 지령
    public void sendDispatchOrder(DispatchOrderRequest data) {
        // 상황실에 응답 전송
//        List<Integer> deadControlEmitters = new ArrayList<>();
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
//        List<Integer> deadDispatchGroupEmitters = new ArrayList<>();
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

    @Override
    // 병원-구급팀 환자 이송 요청
    public void transferRequest(DispatchGroupPatientTransferResponse dispatchGroupData, HospitalPatientTransferResponse hospitalData) {
        // 병원에 응답 전송
        List<Integer> daedHospitalEmitters = new ArrayList<>();
        // 이송 요청 받은 병원에만
        hospitalEmitters.forEach((clientId, emitter) -> {
            List<String> hospitalNames = dispatchGroupData.getHospitalNames();
            List<Integer> hospitalIds = new ArrayList<>();
            for (String hospitalName : hospitalNames) {
                Hospital hospital = hospitalRepository.findByHospitalName(hospitalName)
                        .orElseThrow(() -> new RuntimeException("해당 병원을 찾을 수 없습니다."));
                hospitalIds.add(hospital.getHospitalId());
            }
            if (hospitalIds.contains(clientId)) {
                try {
                    emitter.send(SseEmitter.event()
                            .data(ResponseUtil.success(hospitalData, "환자 이송 요청이 접수되었습니다.")));
                } catch (IOException e) {
                    daedHospitalEmitters.add(clientId);
                }
            }
        });
        daedHospitalEmitters.forEach(hospitalEmitters::remove);

        // 구급팀에 응답 전송
//        List<Integer> deadDispatchGroupEmitters = new ArrayList<>();
        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(dispatchGroupData, "환자 이송 요청이 접수되었습니다.")));
            } catch (IOException e) {
                deadDispatchGroupEmitters.add(clientId);
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }

    @Override
    // 환자 이송요청 수락/거절 알림 => 현재는 수락시에만 알림이 가도록 함
    public void hospitalResponse(AcceptedHospitalResponse response, boolean accepted) {
        String answer = accepted ? "환자 이송 요청이 승인되었습니다." : "환자 이송 요청 거절되었습니다.";

        // to 구급팀
//        List<Integer> deadDispatchGroupEmitters = new ArrayList<>();
        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(response, answer)));
            } catch (IOException e) {
                deadDispatchGroupEmitters.add(clientId);
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }

    @Override
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

    @Override
    // 상황실에 신고자 위치 공유
    public void shareCallerLocation(ShareLocationRequest request) {
        // 상황실에 응답 전송
        List<String> daedControlEmitters = new ArrayList<>();
        controlEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .data(ResponseUtil.success(request, "신고자 위치 수신 성공")));
            } catch (IOException e) {
                daedControlEmitters.add(clientId);
            }
        });
        daedControlEmitters.forEach(controlEmitters::remove);
    }



    private SseEmitter createEmitter(Integer clientId, Map<Integer, SseEmitter> emitters) {
        SseEmitter emitter = new SseEmitter(60000L);
        emitters.put(clientId, emitter);

        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));

        return emitter;
    }
}

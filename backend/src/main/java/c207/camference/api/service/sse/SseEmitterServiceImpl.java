package c207.camference.api.service.sse;

import c207.camference.api.request.control.ControlDispatchOrderRequest;
import c207.camference.api.request.dispatchstaff.DispatchCurrentPositionRequest;
import c207.camference.api.request.user.ShareLocationRequest;
import c207.camference.api.response.dispatchstaff.ControlDispatchOrderResponse;
import c207.camference.api.response.dispatchstaff.DispatchGroupPatientTransferResponse;
import c207.camference.api.response.hospital.AcceptedHospitalResponse;
import c207.camference.api.response.hospital.HospitalPatientTransferResponse;
import c207.camference.db.entity.hospital.Hospital;
import c207.camference.db.entity.hospital.ReqHospital;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.repository.firestaff.DispatchStaffRepository;
import c207.camference.db.repository.hospital.HospitalRepository;
import c207.camference.db.repository.hospital.ReqHospitalRepository;
import c207.camference.db.repository.report.DispatchRepository;
import c207.camference.db.repository.report.TransferRepository;
import c207.camference.util.response.ResponseUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SseEmitterServiceImpl implements SseEmitterService {

    private static final long TIMEOUT = 30 * 60 * 1000L; // 30분
    private static final long HEARTBEAT_DELAY = 25000L;  // 25초

    private final Map<String, SseEmitter> controlEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> dispatchGroupEmitters = new ConcurrentHashMap<>();
//    private final Map<Integer, SseEmitter> hospitalEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> hospitalEmitters = new ConcurrentHashMap<>();
    private final Map<String, SseEmitter> callerEmitters = new ConcurrentHashMap<>();
    private final HospitalRepository hospitalRepository;
    private final ScheduledExecutorService heartbeatExecutor;
    private final DispatchStaffRepository dispatchStaffRepository;
    private final ReqHospitalRepository reqHospitalRepository;
    private final DispatchRepository dispatchRepository;
    private final TransferRepository transferRepository;

    @Autowired
    public SseEmitterServiceImpl(HospitalRepository hospitalRepository, DispatchStaffRepository dispatchStaffRepository, ReqHospitalRepository reqHospitalRepository, DispatchRepository dispatchRepository, TransferRepository transferRepository) {
        this.hospitalRepository = hospitalRepository;
        this.heartbeatExecutor = Executors.newSingleThreadScheduledExecutor();
        this.dispatchStaffRepository = dispatchStaffRepository;
        this.reqHospitalRepository = reqHospitalRepository;
        this.dispatchRepository = dispatchRepository;
        this.transferRepository = transferRepository;
    }

    @PostConstruct
    private void startHeartbeat() {
        heartbeatExecutor.scheduleAtFixedRate(
                this::sendHeartbeat,
                HEARTBEAT_DELAY,
                HEARTBEAT_DELAY,
                TimeUnit.MILLISECONDS
        );
    }

    @PreDestroy
    private void stopHeartbeat() {
        heartbeatExecutor.shutdown();
    }

    private void sendHeartbeat() {
        // Control emitters heartbeat
        List<String> deadControlEmitters = new ArrayList<>();
        controlEmitters.forEach((clientId, emitter) -> {
            try {
                log.info("Attempting to send heartbeat to client: {}", clientId);
                emitter.send(SseEmitter.event()
                        .name("heartbeat")
                        .data("ping")
                        .id(String.valueOf(System.currentTimeMillis())));
                log.info("Successfully sent heartbeat to client: {}", clientId);
            } catch (IOException e) {
                deadControlEmitters.add(clientId);
                log.error("Failed to send heartbeat to client: {} - Error: {}",
                        clientId, e.getMessage());
            }
        });
        deadControlEmitters.forEach(controlEmitters::remove);

        // Dispatch group emitters heartbeat
        List<String> deadDispatchEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("heartbeat")
                        .data("ping")
                        .id(String.valueOf(System.currentTimeMillis())));
            } catch (IOException e) {
                deadDispatchEmitters.add(clientId);
            }
        });
        deadDispatchEmitters.forEach(dispatchGroupEmitters::remove);

        // Hospital emitters heartbeat
        List<String> deadHospitalEmitters = new ArrayList<>();
        hospitalEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("heartbeat")
                        .data("ping")
                        .id(String.valueOf(System.currentTimeMillis())));
            } catch (IOException e) {
                deadHospitalEmitters.add(clientId);
            }
        });
        deadHospitalEmitters.forEach(hospitalEmitters::remove);

        // Caller emitters heartbeat
        List<String> deadCallerEmitters = new ArrayList<>();
        callerEmitters.forEach((clientId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("heartbeat")
                        .data("ping")
                        .id(String.valueOf(System.currentTimeMillis())));
            } catch (IOException e) {
                deadCallerEmitters.add(clientId);
            }
        });
        deadCallerEmitters.forEach(callerEmitters::remove);
    }

    @Override
    public SseEmitter createControlEmitter(String clientId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        controlEmitters.put(clientId, emitter);

        // 초기 연결 메시지 전송
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected!")
                    .id(String.valueOf(System.currentTimeMillis())));
        } catch (IOException e) {
        }

        emitter.onCompletion(() -> controlEmitters.remove(clientId));
        emitter.onTimeout(() -> controlEmitters.remove(clientId));

        return emitter;
    }

    @Override
    public SseEmitter createDispatchGroupEmitter(String clientId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        dispatchGroupEmitters.put(clientId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected!")
                    .id(String.valueOf(System.currentTimeMillis())));
        } catch (IOException e) {
            dispatchGroupEmitters.remove(clientId);
        }

        emitter.onCompletion(() -> dispatchGroupEmitters.remove(clientId));
        emitter.onTimeout(() -> dispatchGroupEmitters.remove(clientId));

        return emitter;
    }

/*
    @Override
    public SseEmitter createHospitalEmitter(Integer clientId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        hospitalEmitters.put(clientId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected!")
                    .id(String.valueOf(System.currentTimeMillis())));
        } catch (IOException e) {
            hospitalEmitters.remove(clientId);
        }
        emitter.onCompletion(() -> hospitalEmitters.remove(clientId));
        emitter.onTimeout(() -> hospitalEmitters.remove(clientId));
        return emitter;
    }
*/

    @Override
    public SseEmitter createHospitalEmitter(String clientId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        hospitalEmitters.put(clientId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected!")
                    .id(String.valueOf(System.currentTimeMillis())));
        } catch (IOException e) {
            hospitalEmitters.remove(clientId);
        }

        emitter.onCompletion(() -> hospitalEmitters.remove(clientId));
        emitter.onTimeout(() -> hospitalEmitters.remove(clientId));

        return emitter;
    }

    @Override
    public SseEmitter createCallerEmitter(String clientId) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        callerEmitters.put(clientId, emitter);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("Connected!")
                    .id(String.valueOf(System.currentTimeMillis())));
        } catch (IOException e) {
            callerEmitters.remove(clientId);
        }

        emitter.onCompletion(() -> callerEmitters.remove(clientId));
        emitter.onTimeout(() -> callerEmitters.remove(clientId));

        return emitter;
    }


    @Override
    // 상황실-구급팀 출동 지령
    public void sendDispatchOrder(ControlDispatchOrderRequest controlData, ControlDispatchOrderResponse dispatchGroupData) {
        List<String> targetDispatchStaffLoginIds = dispatchStaffRepository.findByDispatchGroupId(dispatchGroupData.getDispatchGroupId()).stream()
                .map(dispatchStaff -> dispatchStaff.getFireStaff().getFireStaffLoginId())
                .collect(Collectors.toList());

        // 구급팀에 응답 전송
        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            if (targetDispatchStaffLoginIds.contains(clientId)) {
                try {
                    emitter.send(SseEmitter.event().name("dispatch-order")
                            .data(ResponseUtil.success(dispatchGroupData, "출동 지령 수신")));
                } catch (IOException e) {
                    deadDispatchGroupEmitters.add(clientId);
                }
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }

    @Override
    // 병원-구급팀 환자 이송 요청
    public void transferRequest(DispatchGroupPatientTransferResponse dispatchGroupData, HospitalPatientTransferResponse hospitalData) {
        // 병원에 응답 전송
        List<String> deadHospitalEmitters = new ArrayList<>();
        // 이송 요청 받은 병원에만
        List<String> hospitalNames = dispatchGroupData.getHospitalNames();
        log.info("hospitalNames = " + hospitalNames);
        List<String> targetHospitalLoginIds = hospitalRepository.findByHospitalNameIn(hospitalNames).stream()
                        .map(Hospital::getHospitalLoginId)
                        .collect(Collectors.toList());

        hospitalEmitters.forEach((clientId, emitter) -> {
            if (targetHospitalLoginIds.contains(clientId)) {
                try {
                    emitter.send(SseEmitter.event().name("transfer-request")
                            .data(ResponseUtil.success(hospitalData, "환자 이송 요청이 접수되었습니다.")));
                } catch (IOException e) {
                    deadHospitalEmitters.add(clientId);
                }
            }
        });
        deadHospitalEmitters.forEach(hospitalEmitters::remove);

        // 구급팀에 응답 전송
        Dispatch dispatch = dispatchRepository.findById(dispatchGroupData.getDispatchId())
                .orElseThrow(() -> new RuntimeException("해당 출동내역을 찾을 수 없습니다."));
        List<String> targetDispatchStaffLoginIds = dispatchStaffRepository.findByDispatchGroupId(dispatch.getDispatchGroupId()).stream()
                .map(dispatchStaff -> dispatchStaff.getFireStaff().getFireStaffLoginId())
                .collect(Collectors.toList());

        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            if (targetDispatchStaffLoginIds.contains(clientId)) {
                try {
                    emitter.send(SseEmitter.event().name("transfer-request")
                            .data(ResponseUtil.success(dispatchGroupData, "환자 이송 요청이 접수되었습니다.")));
                } catch (IOException e) {
                    deadDispatchGroupEmitters.add(clientId);
                }
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);
    }

    @Override
    // 환자 이송요청 수락/거절 알림 => 현재는 수락시에만 알림이 가도록 함
    public void hospitalResponse(AcceptedHospitalResponse response, boolean accepted,Integer dispatchId) {
        String answer = accepted ? "환자 이송 요청이 승인되었습니다." : "환자 이송 요청 거절되었습니다.";

        // to 구급팀 (해당 dispatchGroup에 속한 dispatchStaff 에게만)
        Transfer transfer = transferRepository.findById(response.getTransferId())
                .orElseThrow(() -> new RuntimeException("해당 이송내역을 찾을 수 없습니다."));
        List<String> targetDispatchStaffLoginIds = dispatchStaffRepository.findByDispatchGroupId(transfer.getDispatchGroupId()).stream()
                .map(dispatchStaff -> dispatchStaff.getFireStaff().getFireStaffLoginId())
                .collect(Collectors.toList());

        // to 구급대원 현재 구급대원에게 정보 전달
        List<String> deadDispatchGroupEmitters = new ArrayList<>();
        dispatchGroupEmitters.forEach((clientId, emitter) -> {
            if (targetDispatchStaffLoginIds.contains(clientId)) {
                try {
                    emitter.send(SseEmitter.event().name("hospital-response")
                            .data(ResponseUtil.success(response, answer)));
                } catch (IOException e) {
                    deadDispatchGroupEmitters.add(clientId);
                }
            }
        });
        deadDispatchGroupEmitters.forEach(dispatchGroupEmitters::remove);

        // 다른 병원에 일괄 수락여부 전송
        List<ReqHospital> reqHospitals = reqHospitalRepository.findReqHospitalsByDispatchId(dispatchId);

        // 전송할 병원 필터링
//        List<Integer> hospitalIds = new ArrayList<>();
//        for (ReqHospital reqHospital : reqHospitals) {
//            if (reqHospital.getHospitalId().equals(response.getHospitalId())) {
//                continue;
//            }
//            hospitalIds.add(hospitalRepository.findByHospitalId(reqHospital.getHospitalId()).getHospitalId());
//        }

        List<Integer> hospitalIds = reqHospitals.stream()
                .filter(reqHospital -> !reqHospital.getHospitalId().equals(response.getHospitalId()))
                .map(ReqHospital::getHospitalId)
                .collect(Collectors.toList());
        List<String> targetHospitalLoginIds = hospitalRepository.findByHospitalIdIn(hospitalIds).stream()
                .map(Hospital::getHospitalLoginId)
                .collect(Collectors.toList());
//        List<String> targetHospitalLoginIds = reqHospitals.stream()
//                .filter(reqHospital -> !reqHospital.getHospitalId().equals(response.getHospitalId()))
//                .map(ReqHospital::getHospitalId)
//                .map(hospitalId -> hospitalRepository.findByHospitalId(hospitalId).getHospitalLoginId())
//                .collect(Collectors.toList());

        List<String> deadHospitalEmitters = new ArrayList<>();
        hospitalEmitters.forEach((clientId, emitter) -> {
            if (targetHospitalLoginIds.contains(clientId)) {
                try{
                    emitter.send(SseEmitter.event().name("transfer-accepted")
                            .data(ResponseUtil.success(dispatchId,"수락 완료")));
                }catch (IOException e) {
                    deadHospitalEmitters.add(clientId);
                }
            }
        });
        deadHospitalEmitters.forEach(hospitalEmitters::remove);
    }

    @Override
    // 구급차 현재 위치 전송
    public void sendDispatchGroupPosition(DispatchCurrentPositionRequest request) {
        List<String> deadCallerEmitters = new ArrayList<>();
        String sessionId = request.getSessionId();
        callerEmitters.forEach((clientId, emitter) -> {
            if(sessionId.equals(clientId)) {
                try {
                    emitter.send(SseEmitter.event().name("ambulanceLocation-shared")
                            .data(ResponseUtil.success(request, "구급차 현재 위치 공유 성공")));
                } catch (IOException e) {
                    deadCallerEmitters.add(clientId);
                }
            }
        });
        deadCallerEmitters.forEach(callerEmitters::remove);
    }

    @Override
    // 상황실에 신고자 위치 공유
    public void shareCallerLocation(ShareLocationRequest request) {
        // 아이디 분리
        String clientId = request.getSessionId().split("-")[1];
        System.out.println(clientId);

        List<String> deadControlEmitters = new ArrayList<>();
        controlEmitters.forEach((emitterId, emitter) -> {
            if (emitterId.equals(clientId)) {
                try {
                    emitter.send(SseEmitter.event()
                            .data(ResponseUtil.success(request, "신고자 위치 수신 성공")));
                    System.out.println("송신 성공");
                } catch (IOException e) {
                    deadControlEmitters.add(emitterId);
                }
            }
        });
        deadControlEmitters.forEach(controlEmitters::remove);
    }
}

package c207.camference.api.service.fireStaff;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.api.response.dispatchstaff.DispatchGroupResponse;
import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.repository.firestaff.DispatchGroupRepository;
import c207.camference.db.repository.report.CallRepository;
import c207.camference.db.repository.report.DispatchRepository;
import c207.camference.util.response.ResponseUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class ControlOrderServiceImpl implements ControlOrderService {

    private final SimpMessagingTemplate messagingTemplate;
    private final DispatchRepository dispatchRepository;
    private final CallRepository callRepository;
    private final DispatchGroupRepository dispatchGroupRepository;

    @Override
    @Transactional
    public ResponseEntity<?> dispatchOrder(DispatchOrderRequest request) {

        Call call = callRepository.findById(request.getCallId())
                .orElseThrow(() -> new RuntimeException("신고 정보를 찾을 수 없습니다."));

        // 출동 필요 여부 업데이트 (-> true)
        call.setCallIsDispatched(true);

        // 출동 테이블 생성
        Dispatch dispatch = Dispatch.builder()
                .dispatchGroupId(request.getDispatchGroupId())
                .callId(request.getCallId())
                .dispatchCreateAt(LocalDateTime.now())
                .build();

        dispatchRepository.save(dispatch);

        DispatchGroup dispatchGroup = dispatchGroupRepository.findById(request.getDispatchGroupId())
                .orElseThrow(() -> new RuntimeException("출동 그룹을 찾을 수 없습니다."));

        // websocket 메시지 전송
        sendDispatchMessages(request.getDispatchGroupId(), dispatchGroup);

        return ResponseEntity.ok().build(); // HTTP 통신에 대한 응답
    }

    private void sendDispatchMessages(Integer dispatchGroupId, DispatchGroup dispatchGroup) {
        // 춡동 지령 전송
        DispatchGroupResponse response = DispatchGroupResponse.builder()
                .dispatchGroupId(dispatchGroupId)
                .fireDeptId(dispatchGroup.getFireDeptId())
                .build();

        ResponseData<?> dispatchResponse = ResponseUtil.success(response, "출동 지령 수신");
        messagingTemplate.convertAndSend(
                "/topic/dispatch/" + dispatchGroupId,
                dispatchResponse,
                createHeaders("delivery_status")
        );

        ResponseData<?> controlResponse = ResponseUtil.success(response, "출동 지령 전송 성공");
        messagingTemplate.convertAndSend(
                "/topic/control/" + dispatchGroupId,
                controlResponse,
                createHeaders("notification")
        );
    }

    private MessageHeaders createHeaders(String eventType) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("event", eventType);
        return new MessageHeaders(headers);
    }
}
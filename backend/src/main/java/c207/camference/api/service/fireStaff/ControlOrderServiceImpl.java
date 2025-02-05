package c207.camference.api.service.fireStaff;

import c207.camference.api.request.control.DispatchOrderRequest;
import c207.camference.api.response.common.ResponseData;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.report.Dispatch;
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


@Service
@RequiredArgsConstructor
@Slf4j
public class ControlOrderServiceImpl implements ControlOrderService {

    private final SimpMessagingTemplate messagingTemplate;
    private final DispatchRepository dispatchRepository;
    private final CallRepository callRepository;

    @Override
    @Transactional
    public ResponseEntity<?> dispatchOrder(DispatchOrderRequest request) {
        Dispatch dispatch = dispatchRepository.findByDispatchGroupId(request.getDispatchGroupId())
                .orElseThrow(() -> new RuntimeException("출동 정보를 찾을 수 없습니다."));

        Call call = callRepository.findById(dispatch.getCallId())
                .orElseThrow(() -> new RuntimeException("신고 정보를 찾을 수 없습니다."));

        // 출동 필요 여부 업데이트 (-> true)
        call.setCallIsDispatched(true);

        // dispatch 업데이트
        dispatch.setDispatchGroupId(request.getDispatchGroupId()); // 출동팀
        dispatch.setDispatchDepartAt(LocalDateTime.now()); // 현장 출동 시작 시각

        // websocket 메시지 전송
        sendDispatchMessages(request.getDispatchGroupId(), dispatch);

        return ResponseEntity.ok().build(); // HTTP 통신에 대한 응답
    }

    private void sendDispatchMessages(Integer dispatchGroupId, Dispatch dispatch) {
        // 춡동 지령 전송
        ResponseData<Integer> dispatchResponse = ResponseUtil.success(dispatchGroupId, "출동 지령 수신 성공"); // 웹소켓 통신 응답

        messagingTemplate.convertAndSend(
                "/topic/dispatch/" + dispatchGroupId,
                dispatchResponse,
                createHeaders("delivery_status")
        );

        ResponseData<Integer> controlResponse = ResponseUtil.success(dispatchGroupId, "출동 지령 전송 선공"); // 웹소켓 통신 응답

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
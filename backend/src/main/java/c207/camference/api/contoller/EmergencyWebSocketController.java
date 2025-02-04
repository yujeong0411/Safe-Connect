package c207.camference.api.contoller;

import c207.camference.api.response.common.ResponseData;
import c207.camference.util.response.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class EmergencyWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final EmergencyService emergencyService;

    @MessageMapping("//control/dispatch_group_order")
    public void handleDispatchCommand(DispatchCommand command) {
        try {
            // 1. 명령 처리
            Integer dispatchGroupId = emergencyService.processDispatchCommand(command);
            DispatchData dispatchData = new DispatchData();
            dispatchData.setDispatchGroupId(dispatchGroupId);

            // 2. 상황실에 발송 성공 응답 보내기
            ResponseData<DispatchData> controlResponse = ResponseUtil.success(dispatchData, "가용 가능한 소방팀에게 출동 지령 전송 성공");

            messagingTemplate.convertAndSendToUser(command.getControlCenterId(),
                    "/queue/dispatch-response",
                    controlResponse,
                    createHeaders("notification")
            );

            // 3. 구급팀에 알림 전송하기
            ResponseData<DispatchData> paramedicResponse = ResponseUtil.success(dispatchData, "출동 지령 수신");

            messagingTemplate.convertAndSendToUser(
                    command.getParamedicId(),
                    "/queue/dispatch-notification",
                    paramedicResponse,
                    createHeaders("delivery_status")
            );
        } catch (Exception e) {
            handleError(command, e);
        }
    }

    private MessageHeaders createHeaders(String eventType) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("evnet", eventType);
        return new MessageHeaders(headers);
    }

    private void handleError(DispatchCommand command, Exception e) {
        ResponseData<Object> errorResponse = ResponseUtil.success(null, "출동 지령 처리 중 오류 발생: " + e.getMessage());

        messagingTemplate.convertAndSendToUser(
                command.getControlCenterId(),
                "/queue/errors",
                errorResponse
        );
    }
}

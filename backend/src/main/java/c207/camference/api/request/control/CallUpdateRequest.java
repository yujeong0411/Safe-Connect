package c207.camference.api.request.control;

import lombok.Getter;

@Getter
public class CallUpdateRequest {

    private Integer userId;
    private Integer callId;
    private String symptom;
    private String callSummary;
    private String callText;

}

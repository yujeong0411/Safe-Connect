package c207.camference.api.response.report;

import lombok.*;

@Getter
@Setter
public class CallDto {

    private Integer callId;
    private Boolean callIsDispatched;
    private String callSummary;
    private String callText;
}
